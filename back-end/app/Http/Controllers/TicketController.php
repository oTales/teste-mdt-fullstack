<?php

namespace App\Http\Controllers;

use App\Common\Abstracts\AbstractController;
use App\Domains\Ticket\Services\TicketService;
use App\Http\Requests\Ticket\CreateTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends AbstractController
{
    protected ?string $requestValidateUpdate = UpdateTicketRequest::class;
    protected ?string $requestValidate = CreateTicketRequest::class;

    public function __construct(TicketService $service)
    {
        $this->service = $service;
    }

    public function getTicketsPaginated(Request $request): ?JsonResponse
    {
        try {
            return $this->ok($this->service->getTicketsPaginated($request->all()));
        }catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function getMetrics(Request $request): ?JsonResponse
    {
        try {
            return $this->ok([
               'total_tickets' => $this->service->getTotalTickets(),
                'closed_tickets' => $this->service->getTotalClosedTickets(),
                'open_tickets' => $this->service->getTotalOpenTickets(),
                'resolved_tickets' => $this->service->getTotalResolvedTickets(),
                'in_progress_tickets' => $this->service->getTotalInProgressTickets(),
            ]);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
