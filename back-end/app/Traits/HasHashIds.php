<?php

namespace App\Traits;

use Hashids\Hashids;

trait HasHashIds
{
    /**
     * The minimum hash length.
     */
    private int $minHashLength = 5;

    /**
     * The alphabet string.
     */
    private string $alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

    /**
     * The salt string.
     */
    private function salt(): string
    {
        return $this->getTable();
    }

    public function hash(): ?string
    {
        if (! $this->id) {
            return null;
        }

        $hashids = new Hashids($this->salt(), $this->minHashLength, $this->alphabet);

        return $this->prefix().$hashids->encode($this->id);
    }

    public static function decodeHash($hash)
    {
        $class = static::class;

        $model = new $class;

        $hashids = new Hashids($model->getTable(), 5, $model->alphabet);

        return $hashids->decode(substr($hash, 3))[0] ?? null;
    }

    public static function encodeHash($id): ?string
    {
        if (! $id) {
            return null;
        }
        $class   = static::class;
        $model   = new $class;
        $hashids = new Hashids($model->getTable(), 5, $model->alphabet);

        return $model->prefix().$hashids->encode($id);
    }

    /**
     * Return the prefix of the table.
     */
    public function prefix(): string
    {
        $table = $this->getTable();

        if (! strpos($table, '_')) {
            return $table[0].$table[1].$table[2];
        }

        $prefix = explode('_', $table);

        return $prefix[0][0].$prefix[0][1].$prefix[1][0];
    }

    /**
     * Find a model by its hash.
     */
    public static function findByHash(string $hash): mixed
    {
        return static::find(static::decodeHash($hash));
    }

    /**
     * Set the hash attribute.
     */
    public function getHashAttribute(): ?string
    {
        return $this->hash();
    }
}
