<?php

namespace App\Domains\User\Services;

use App\Common\Abstracts\AbstractService;
use App\Domains\User\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use App\Notifications\NotifyUserCreated;

class UserService extends AbstractService
{
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function beforeSave(array $params): array
    {
        if (isset($params['password'])) {
            $params['password'] = Hash::make($params['password']);
        }

        return $params;
    }

    public function findByEmail(string $email)
    {
        return $this->repository->findByEmail($email);
    }

    public function createToken($user)
    {
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function afterSave($entity, array $params)
    {
        $entity->notify(new NotifyUserCreated($entity));

        return $entity;
    }
}
