<?php

namespace App\Domains\User\Repositories;

use App\Common\Abstracts\AbstractRepository;
use App\Models\User;

class UserRepository extends AbstractRepository
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function findByEmail(string $email)
    {
        return $this->getModel()->where('email', $email)->first();
    }
}

