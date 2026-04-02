<?php

namespace App\Domains\Ticket\Repositories;

use App\Common\Abstracts\AbstractRepository;
use App\Models\Ticket;

class TicketRepository extends AbstractRepository
{
    public function __construct(Ticket $model) {
        $this->model = $model;
    }

    public function all($params = null, $with = [])
    {
        return $this->model->query()
            ->when(isset($params['status']), function ($query) use ($params) {
                $query->where('status', $params['status']);
            })
            ->when(!empty($params['priority']), function ($query) use ($params) {
                $query->where('priority', $params['priority']);
            })
            ->when(!empty($params['search']), function ($query) use ($params) {
                logger($params['search']);
                $query->where(function ($query) use ($params) {
                    $query->where('name', 'like', '%' . $params['search'] . '%')
                        ->orWhere('subject', 'like', '%' . $params['search'] . '%');
                });
            })
            ->paginate(20);
    }
}
