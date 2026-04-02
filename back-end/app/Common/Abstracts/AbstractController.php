<?php

namespace App\Common\Abstracts;

use App\Common\Traits\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

abstract class AbstractController extends Controller
{
    protected array $with = [];

    protected array $withCount = [];

    protected mixed $service;

    protected ?string $requestValidate;

    protected ?string $requestValidateUpdate;

    protected array $validated = [];

    protected array $validatedUpdate = [];

    public function index(Request $request)
    {
        if (! isset($request->with)) {
            $request->with = $this->with;
        }

        $items = $this
            ->service
            ->getAll($request->all(), $request->with)
            ->toArray();

        return $this->ok($items);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            if ($this->requestValidate) {
                $requestValidate = app($this->requestValidate);
                $this->validated = $requestValidate->validated();
            }
        } catch (ValidationException $e) {
            return $this->error($this->messageErrorDefault, $e->errors());
        }

        try {
            DB::beginTransaction();
            $response = $this->service->save(array_merge($request->toArray(), $this->validated ??= []));
            DB::commit();

            return $this->success($this->messageSuccessDefault, ['response' => $response]);
        } catch (\Exception|ValidationException $e) {
            DB::rollBack();
            Context::add($this->validated ?? $request->all());

            if ($e instanceof ValidationException) {
                report($e);
                Log::info($e->getMessage());

                return $this->error($this->messageErrorDefault, $e->errors());
            }
            if ($e instanceof \Exception) {
                report($e);
                Log::error($e->getLine(), (array) $e->getFile());

                return $this->error($e->getMessage());
            }
            return $this->error('Erro desconhecido');
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            if (! empty($this->requestValidateUpdate)) {
                $requestValidateUpdate = app($this->requestValidateUpdate);
                $this->validatedUpdate = $requestValidateUpdate->validated();
            }
        } catch (ValidationException $e) {
            return $this->error($this->messageErrorDefault, $e->errors());
        }

        try {
            DB::beginTransaction();
            $response = $this->service->update($id, array_merge($request->toArray(), $this->validatedUpdate ??= []));
            DB::commit();

            return $this->success($this->messageSuccessDefault, ['response' => $response]);
        } catch (\Exception|ValidationException $e) {
            DB::rollBack();
            if ($e instanceof \Exception) {
                return $this->error($e->getMessage());
            }
            if ($e instanceof ValidationException) {
                return $this->error($this->messageErrorDefault, $e->errors());
            }
            return $this->error('Erro desconhecido');
        }
    }

    public function show($id, Request $request): JsonResponse
    {
        if (! isset($request->with)) {
            $request->with = $this->with;
        }

        if (! isset($request->withCount)) {
            $request->withCount = $this->withCount;
        }

        try {
            return $this->ok($this->service->find($id, $request->with, $request->withCount)->toArray());
        } catch (\Exception|ValidationException $e) {
            DB::rollBack();
            if ($e instanceof \Exception) {
                return $this->error($e->getMessage());
            }
            if ($e instanceof ValidationException) {
                return $this->error($this->messageErrorDefault, $e->errors());
            }
            return $this->error('Erro desconhecido');
        }
    }

    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->service->delete($id);
            DB::commit();

            return $this->success($this->messageSuccessDefault);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->error($e->getMessage());
        }
    }

    /**
     * @param null $id
     */
    public function preRequisite($id = null): JsonResponse
    {
        $preRequisite = $this->service->preRequisite($id);

        return $this->ok(compact('preRequisite'));
    }

    public function toSelect(): JsonResponse
    {
        return $this->ok($this->service->toSelect(request()->all()));
    }
}
