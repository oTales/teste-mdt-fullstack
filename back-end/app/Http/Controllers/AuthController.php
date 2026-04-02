<?php

namespace App\Http\Controllers;

use App\Common\Abstracts\AbstractController;
use App\Domains\User\Services\UserService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends AbstractController
{
    protected ?string $requestValidate = RegisterRequest::class;

    protected string $messageSuccessDefault = 'Operação de autenticação realizada com sucesso';
    protected string $messageErrorDefault = 'Falha ao processar autenticação';

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            DB::beginTransaction();

            $user = $this->service->save($validated);
            $token = $this->service->createToken($user);

            DB::commit();

            return $this->success('Usuário registrado com sucesso', [
                'user' => $user,
                'token' => $token,
            ]);
        } catch (ValidationException $e) {
            DB::rollBack();

            return $this->error($this->messageErrorDefault, $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);

            return $this->error($e->getMessage());
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();

            $user = $this->service->findByEmail($credentials['email']);

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return $this->error('Email ou senha inválidos', [], 401);
            }

            DB::beginTransaction();
            $token = $this->service->createToken($user);
            DB::commit();

            return $this->success('Login realizado com sucesso', [
                'user' => $user,
                'token' => $token,
            ]);
        } catch (ValidationException $e) {
            DB::rollBack();

            return $this->error($this->messageErrorDefault, $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);

            return $this->error($e->getMessage());
        }
    }

    public function me(Request $request): JsonResponse
    {
        try {
            return $this->ok([
                'user' => $request->user(),
            ]);
        } catch (\Exception $e) {
            report($e);
            Log::error($e->getMessage());
            return $this->error($e->getMessage());
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $request->user()->currentAccessToken()->delete();
            DB::commit();

            return $this->success('Logout realizado com sucesso');
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);

            return $this->error($e->getMessage());
        }
    }
}


