<?php

namespace App\Common\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected string $messageErrorDefault = 'Erro ao processar a solicitação';
    protected string $messageSuccessDefault = 'Operação realizada com sucesso';

    protected function ok($data = [], int $code = 200): JsonResponse
    {
        return response()->json($data, $code);
    }

    protected function success($message = null, $data = [], int $code = 200): JsonResponse
    {
        return response()->json(array_merge([
            'message' => $message ?? $this->messageSuccessDefault,
        ], $data), $code);
    }

    protected function error($message = null, $errors = null, int $code = 400): JsonResponse
    {
        $response = [
            'message' => $message ?? $this->messageErrorDefault,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}

