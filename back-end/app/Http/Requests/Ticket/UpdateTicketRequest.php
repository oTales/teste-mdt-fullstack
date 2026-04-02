<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required'],
            'subject' => ['sometimes', 'required'],
            'description' => ['sometimes', 'required'],
            'status' => ['sometimes', 'required'],
            'priority' => ['sometimes', 'required'],
        ];
    }

    public function attributes(): array
    {
        return  [
            'name.required' => 'O nome é obrigatório',
            'subject.required' => 'O assunto é obrigatório',
            'description.required' => 'A descrição é obrigatória',
            'status.required' => 'O status é obrigatório',
            'priority.required' => 'A prioridade é obrigatória',
        ];
    }
}
