<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class GenerateBaseClasses extends Command
{
    protected $signature   = 'generate:base-classes {name}';
    protected $description = 'Gera service, repository, model, controller e form requests com base em stubs';

    protected Filesystem $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    public function handle()
    {
        $name      = Str::studly($this->argument('name'));
        $tableName = Str::snake(Str::pluralStudly($name));

        if (! $this->validateTable($tableName)) {
            return;
        }

        $columns         = Schema::getColumnListing($tableName);
        $fillableColumns = array_diff($columns, ['id', 'uuid', 'created_at', 'updated_at', 'deleted_at']);

        if (! $this->validateExistsClasses($name)) {
            return;
        }

        $paths = $this->getPaths($name);
        $this->createDirectories($paths);

        $this->generateService($name, $paths['service']);
        $this->generateRepository($name, $paths['repository']);
        $this->generateModel($name, $tableName, $fillableColumns, $paths['model']);
        $this->generateController($name, $paths['controller']);
        $this->generateCreateRequest($name, $fillableColumns, $paths['requests']);
        $this->generateUpdateRequest($name, $fillableColumns, $paths['requests']);
        $this->generatePolicy($name, $paths['policy']);

        $this->info("✓ Service, Repository, Model, Controller, Form Requests e Policy para '{$name}' gerados com sucesso!");
    }

    private function validateTable(string $tableName): bool
    {
        if (! Schema::hasTable($tableName)) {
            $this->error("✗ A tabela '{$tableName}' não existe.");
            return false;
        }
        return true;
    }

    private function getPaths(string $name): array
    {
        return [
            'service'    => app_path("Domains/{$name}/Services"),
            'repository' => app_path("Domains/{$name}/Repositories"),
            'model'      => app_path('Models'),
            'controller' => app_path('Http/Controllers'),
            'requests'   => app_path("Http/Requests/{$name}"),
            'policy'     => app_path('Policies'),
        ];
    }

    private function createDirectories(array $paths): void
    {
        foreach ($paths as $path) {
            if (! is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }
    }

    private function generateService(string $name, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/Service.stub'));

        $content = str_replace(
            ['{{ namespace }}', '{{ class }}'],
            ["App\\Domains\\{$name}\\Services", $name],
            $stub
        );

        $this->writeFile($path, "{$name}Service.php", $content);
    }

    private function generateRepository(string $name, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/Repository.stub'));

        $content = str_replace(
            ['{{ namespace }}', '{{ class }}'],
            ["App\\Domains\\{$name}\\Repositories", $name],
            $stub
        );

        $this->writeFile($path, "{$name}Repository.php", $content);
    }

    private function generateModel(string $name, string $tableName, array $fillableColumns, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/Model.stub'));
        $fillableString = $this->prepareFillableString($fillableColumns);

        $content = str_replace(
            ['{{ class }}', '{{ table }}', '{{ fillable_fields }}'],
            [$name, $tableName, $fillableString],
            $stub
        );

        $this->writeFile($path, "{$name}.php", $content);
    }

    private function generateController(string $name, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/Controller.stub'));

        $content = str_replace(
            ['{{ class }}'],
            [$name],
            $stub
        );

        $this->writeFile($path, "{$name}Controller.php", $content);
    }

    private function generateCreateRequest(string $name, array $fillableColumns, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/CreateRequest.stub'));
        $rulesString = $this->prepareCreateRulesString($fillableColumns);

        $content = str_replace(
            ['{{ class }}', '{{ validation_rules }}'],
            [$name, $rulesString],
            $stub
        );

        $this->writeFile($path, "Create{$name}Request.php", $content);
    }

    private function generateUpdateRequest(string $name, array $fillableColumns, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/UpdateRequest.stub'));
        $rulesString = $this->prepareUpdateRulesString($fillableColumns);

        $content = str_replace(
            ['{{ class }}', '{{ validation_rules }}'],
            [$name, $rulesString],
            $stub
        );

        $this->writeFile($path, "Update{$name}Request.php", $content);
    }

    private function generatePolicy(string $name, string $path): void
    {
        $stub = $this->files->get(app_path('Common/Stubs/Policy.stub'));
        $modelVariable = strtolower($name);

        $content = str_replace(
            ['{{ class }}', '{{ modelVariable }}'],
            [$name, $modelVariable],
            $stub
        );

        $this->writeFile($path, "{$name}Policy.php", $content);
    }

    private function writeFile(string $path, string $filename, string $content): void
    {
        $filePath = $path . DIRECTORY_SEPARATOR . $filename;

        if ($this->files->exists($filePath)) {
            $this->warn("✗ Arquivo já existe: {$filename}");
            return;
        }

        $this->files->put($filePath, $content);
        $this->line("  ✓ {$filename}");
    }

    private function prepareFillableString(array $fillableColumns): string
    {
        return implode('', array_map(
            fn($col) => "            '{$col}',\n",
            $fillableColumns
        ));
    }

    private function prepareCreateRulesString(array $fillableColumns): string
    {
        return implode('', array_map(
            fn($col) => "            '{$col}' => ['required'],\n",
            $fillableColumns
        ));
    }

    private function prepareUpdateRulesString(array $fillableColumns): string
    {
        return implode('', array_map(
            fn($col) => "            '{$col}' => ['sometimes', 'required'],\n",
            $fillableColumns
        ));
    }

    private function validateExistsClasses(string $name): bool
    {
        $classesToCheck = [
            "App\\Domains\\{$name}\\Services\\{$name}Service"        => "O serviço '{$name}Service' já existe.",
            "App\\Domains\\{$name}\\Repositories\\{$name}Repository" => "O repositório '{$name}Repository' já existe.",
            "App\\Models\\{$name}"                                   => "O modelo '{$name}' já existe.",
            "App\\Http\\Controllers\\{$name}Controller"              => "O controlador '{$name}Controller' já existe.",
            "App\\Http\\Requests\\{$name}\\Create{$name}Request"     => "A requisição 'Create{$name}Request' já existe.",
            "App\\Http\\Requests\\{$name}\\Update{$name}Request"     => "A requisição 'Update{$name}Request' já existe.",
            "App\\Policies\\{$name}Policy"                           => "A policy '{$name}Policy' já existe.",
        ];

        foreach ($classesToCheck as $class => $errorMessage) {
            if (class_exists($class)) {
                $this->error("✗ {$errorMessage}");
                return false;
            }
        }

        return true;
    }
}
