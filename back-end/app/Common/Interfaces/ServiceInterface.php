<?php

namespace App\Common\Interfaces;

interface ServiceInterface
{
    public function validateOnInsert(array $params);

    public function validateOnUpdate(int $id, array $params);

    public function afterSave($entity, array $params);

    public function afterUpdate($entity, array $params);

    public function afterDelete($entity);

    public function beforeSave(array $params);

    public function beforeUpdate($entity, array $params);

    public function beforeDelete($entity);

    public function getAll(array $params = [], $with = []);

    public function find($id, array $with = [], array $withCount = []);

    public function create(array $params);

    public function update(int $id, array $params);

    public function delete(int $id);

    public function save(array $params);
}
