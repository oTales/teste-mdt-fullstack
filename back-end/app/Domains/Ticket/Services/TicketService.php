<?php

namespace App\Domains\Ticket\Services;

use App\Common\Abstracts\AbstractService;
use App\Domains\Ticket\Repositories\TicketRepository;
use App\Enums\TicketsStatusEnum;
use App\Notifications\NotifyUserTicketCreated;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\LengthAwarePaginator;

class TicketService extends AbstractService
{
    public function __construct(TicketRepository $repository)
    {
        $this->repository = $repository;
    }

    public function beforeSave(array $params): array
    {
        $params['user_id'] = auth()->id();

        return $params;
    }

    public function getTicketsPaginated(array $params): LengthAwarePaginator|AbstractPaginator
    {
        return $this->repository->all($params);
    }

    public function getTotalOpenTickets()
    {
        return $this->repository->where(['status' => TicketsStatusEnum::OPEN])->count();
    }

    public function getTotalClosedTickets()
    {
        return $this->repository->where(['status' => TicketsStatusEnum::CLOSED])->count();
    }

    public function getTotalResolvedTickets()
    {
        return $this->repository->where(['status' => TicketsStatusEnum::RESOLVED])->count();
    }

    public function getTotalInProgressTickets()
    {
        return $this->repository->where(['status' => TicketsStatusEnum::IN_PROGRESS])->count();
    }

    public function getTotalTickets()
    {
        return $this->getAll()->count();
    }

    public function afterSave($entity, array $params)
    {
        $entity->user->notify(new NotifyUserTicketCreated($entity->user, $entity));

        return $entity;
    }
}
