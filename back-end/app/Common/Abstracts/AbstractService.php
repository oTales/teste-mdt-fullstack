<?php

namespace App\Common\Abstracts;

use App\Common\Interfaces\ServiceInterface;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AbstractService implements ServiceInterface
{
    protected $with = [];

    /**
     * @var AbstractRepository
     */
    public $repository;

    public function getAll(array $params = [], $with = [])
    {
        return $this->repository->where($params, $with);
    }

    public function all(array $params = [], $with = [])
    {
        return $this->repository->all($params, $with);
    }

    /**
     * @throws Exception
     */
    public function find($id, array $with = [], array $withCount = [])
    {
        $result = $this->repository->find($id, $with, $withCount);

        if ($result == null) {
            throw new ModelNotFoundException(get_class($this->repository->getModel()));
        }

        return $result;
    }

    public function findWithoutException($id, array $with = [], array $withCount = [])
    {
        return $this->repository->find($id, $with, $withCount);
    }

    public function validateOnInsert(array $params): bool
    {
        return true;
    }

    public function validateOnUpdate($id, array $params): bool
    {
        return true;
    }

    public function validateOnDelete($id): bool
    {
        return true;
    }

    public function afterSave($entity, array $params)
    {
        return $entity;
    }

    public function afterUpdate($entity, array $params)
    {
        return $entity;
    }

    public function afterDelete($entity)
    {
        return $entity;
    }

    public function beforeSave(array $params): array
    {
        return $params;
    }

    public function beforeUpdate($id, array $params)
    {
        return $params;
    }

    public function beforeDelete($id)
    {
        return $id;
    }

    public function create(array $params)
    {
        $entity = $this->repository->create($params);
        $this->afterSave($entity, $params);

        return $entity;
    }

    public function update($id, array $params)
    {
        $params = $this->beforeUpdate($id, $params);
        $entity = $this->find($id);
        if (! $this->validateOnUpdate($id, $params)) {
            return $entity;
        }

        $updated = $this->repository->update($entity, $params);

        if ($updated) {
            $this->afterUpdate($entity, $params);
        }

        return $entity->refresh();
    }

    public function delete($id): int|string
    {
        $entity = $this->find($id);
        $this->validateOnDelete($id);
        $this->beforeDelete($id);
        $this->repository->delete($id);
        $this->afterDelete($entity);

        return $id;
    }

    public function save(array $params)
    {
        $params = $this->beforeSave($params);
        if ($this->validateOnInsert($params) !== false) {
            $entity = $this->repository->create($params);
            $this->afterSave($entity, $params);

            return $entity;
        }

        return false;
    }

    public function where(array $where, array $with = [], array $withCount = [])
    {
        return $this->repository->where($where, $with, $withCount);
    }

    public function findOneWhere(array $where, array $with = [], array $withCount = [])
    {
        return $this->repository->findOneWhere($where, $with, $withCount);
    }

    public function getRepository()
    {
        return $this->repository;
    }

    public function createOrUpdate($params, $paramsValidator)
    {
        $params = $this->beforeCreateOrUpdate($params);
        if ($this->validateOnInsert($params) !== false) {
            $entity = $this->repository->createOrUpdate($paramsValidator, $params);
            $this->afterCreateOrUpdate($entity, $params);

            return $entity;
        }

        return false;
    }

    public function afterCreateOrUpdate($entity, array $params)
    {
        return $entity;
    }

    public function beforeCreateOrUpdate(array $params): array
    {
        return $params;
    }

    public function toSelect(array $select, array $where = [], array $with = [], array $withCount = [])
    {
        return $this->repository->toSelect($select, $where, $with, $withCount);
    }

    public function lastOneWhere(array $where, array $with = [], array $withCount = [])
    {
        return $this->repository->lastOneWhere($where, $with, $withCount);
    }
}
