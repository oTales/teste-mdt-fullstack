#!/bin/bash

################################################################################
# Ticket Management API - cURL Examples & Testing Script
#
# Este script contém exemplos de todas as rotas da API de Gerenciamento de Tickets
# Você pode executar cada comando individualmente ou usar todo o script
#
# Uso:
#   chmod +x API_EXAMPLES.sh
#   ./API_EXAMPLES.sh
#
# Variáveis de Ambiente (customize conforme necessário):
#   BASE_URL - URL base da API (padrão: http://localhost:8000/api)
#   TOKEN - Token de autenticação (será preenchido automaticamente após login)
#
# Dependências:
#   - curl
#   - jq (opcional, para formatação JSON)
#
################################################################################

set -e

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

BASE_URL="${BASE_URL:-http://localhost:8000/api}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variáveis globais
TOKEN=""
USER_ID=""
TICKET_ID=""

# ============================================================================
# FUNÇÕES AUXILIARES
# ============================================================================

# Função para limpar tokens de requisições anteriores
cleanup() {
    echo -e "${CYAN}[LIMPEZA]${NC} Removendo arquivos temporários..."
    rm -f /tmp/api_*.txt 2>/dev/null || true
}

# Trap para executar cleanup ao sair
trap cleanup EXIT

# Função para exibir header de seção
print_section() {
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC} $1"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Função para exibir subsection
print_subsection() {
    echo -e "${BLUE}─ $1${NC}"
}

# Função para fazer requisição e salvar resposta
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=$4

    local headers="-H 'Content-Type: application/json' -H 'Accept: application/json'"

    if [ "$auth" == "true" ] && [ -n "$TOKEN" ]; then
        headers="$headers -H 'Authorization: Bearer $TOKEN'"
    fi

    local cmd="curl -s -X $method '${BASE_URL}${endpoint}' $headers"

    if [ -n "$data" ]; then
        cmd="$cmd -d '$data'"
    fi

    eval "$cmd"
}

# Função para fazer requisição e extrair token
make_request_and_extract_token() {
    local method=$1
    local endpoint=$2
    local data=$3

    local response=$(make_request "$method" "$endpoint" "$data" false)

    echo "$response"

    # Tentar extrair token da resposta
    TOKEN=$(echo "$response" | jq -r '.token // empty' 2>/dev/null)
    USER_ID=$(echo "$response" | jq -r '.user.id // empty' 2>/dev/null)
}

# Função para exibir resposta formatada
print_response() {
    local title=$1
    local response=$2

    echo -e "${GREEN}✓ Resposta:${NC}"

    # Se jq está disponível, formatar JSON
    if command -v jq &> /dev/null; then
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo "$response"
    fi
}

# Função para fazer requisição e exibir resultado
request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=${4:-true}

    local response=$(make_request "$method" "$endpoint" "$data" "$auth")
    print_response "$method $endpoint" "$response"

    echo "$response"
}

# ============================================================================
# ROTAS DE AUTENTICAÇÃO
# ============================================================================

test_register() {
    print_section "🔐 TESTE 1: REGISTRAR NOVO USUÁRIO"

    print_subsection "POST /register"
    echo "Criando nova conta de usuário..."

    local payload='{
        "name": "João Silva",
        "email": "joao@example.com",
        "password": "senha123456"
    }'

    echo -e "${CYAN}Payload:${NC}"
    echo "$payload" | jq '.' 2>/dev/null || echo "$payload"
    echo ""

    local response=$(make_request_and_extract_token "POST" "/register" "$payload")
    print_response "Register" "$response"

    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✓ Token obtido com sucesso!${NC}"
        echo "Token: ${TOKEN:0:30}..."
    else
        echo -e "${YELLOW}⚠ Token não foi retornado. Será necessário fazer login.${NC}"
    fi
}

test_login() {
    print_section "🔐 TESTE 2: LOGIN DE USUÁRIO"

    print_subsection "POST /login"
    echo "Fazendo login com credenciais..."

    local payload='{
        "email": "joao@example.com",
        "password": "senha123456"
    }'

    echo -e "${CYAN}Payload:${NC}"
    echo "$payload" | jq '.' 2>/dev/null || echo "$payload"
    echo ""

    local response=$(make_request_and_extract_token "POST" "/login" "$payload")
    print_response "Login" "$response"

    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✓ Login realizado com sucesso!${NC}"
        echo "Token: ${TOKEN:0:30}..."
    fi
}

test_get_current_user() {
    print_section "🔐 TESTE 3: OBTER USUÁRIO ATUAL"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    print_subsection "GET /me"
    echo "Obtendo dados do usuário autenticado..."

    local response=$(request "GET" "/me" "" true)
}

test_logout() {
    print_section "🔐 TESTE 4: LOGOUT"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    print_subsection "POST /logout"
    echo "Fazendo logout..."

    local response=$(request "POST" "/logout" "" true)
    TOKEN=""
    echo -e "${GREEN}✓ Logout realizado. Token revogado.${NC}"
}

# ============================================================================
# ROTAS DE TICKETS
# ============================================================================

test_create_ticket() {
    print_section "🎫 TESTE 5: CRIAR NOVO TICKET"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    print_subsection "POST /tickets"
    echo "Criando novo ticket..."

    local payload='{
        "name": "Bug no Sistema de Login",
        "subject": "Usuários não conseguem fazer login",
        "description": "Alguns usuários estão reportando que não conseguem fazer login no sistema. Quando tentam fazer login, recebem um erro genérico sem detalhes.",
        "status": 1,
        "priority": 4
    }'

    echo -e "${CYAN}Payload:${NC}"
    echo "$payload" | jq '.' 2>/dev/null || echo "$payload"
    echo ""

    local response=$(make_request "POST" "/tickets" "$payload" true)
    print_response "Create Ticket" "$response"

    # Extrair o hash do ticket para testes posteriores
    TICKET_ID=$(echo "$response" | jq -r '.response.hash // empty' 2>/dev/null)

    if [ -n "$TICKET_ID" ]; then
        echo -e "${GREEN}✓ Ticket criado com sucesso!${NC}"
        echo "ID do Ticket: $TICKET_ID"
    fi
}

test_get_all_tickets() {
    print_section "🎫 TESTE 6: LISTAR TODOS OS TICKETS"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    print_subsection "GET /tickets"
    echo "Listando todos os tickets sem paginação..."

    local response=$(request "GET" "/tickets" "" true)
}

test_get_tickets_paginated() {
    print_section "🎫 TESTE 7: LISTAR TICKETS (PAGINADO)"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    print_subsection "GET /tickets-paginated"
    echo "Listando tickets com paginação (página 1)..."

    local response=$(make_request "GET" "/tickets-paginated?page=1" "" true)
    print_response "Get Tickets Paginated" "$response"

    # Exibir informações de paginação
    if command -v jq &> /dev/null; then
        echo ""
        echo -e "${CYAN}Informações de Paginação:${NC}"
        echo "$response" | jq '.meta' 2>/dev/null || true
    fi
}

test_get_single_ticket() {
    print_section "🎫 TESTE 8: OBTER TICKET ESPECÍFICO"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    if [ -z "$TICKET_ID" ]; then
        echo -e "${YELLOW}⚠ Aviso: ID do ticket não está definido. Tentando obter do banco de dados...${NC}"
        echo "Use o comando abaixo para obter um ticket específico:"
        echo "curl -X GET '${BASE_URL}/tickets/{ticket_hash}' \\"
        echo "  -H 'Authorization: Bearer \${TOKEN}'"
        return
    fi

    print_subsection "GET /tickets/{id}"
    echo "Obtendo dados do ticket específico: $TICKET_ID"
    echo ""

    local response=$(make_request "GET" "/tickets/$TICKET_ID" "" true)
    print_response "Get Single Ticket" "$response"
}

test_update_ticket() {
    print_section "🎫 TESTE 9: ATUALIZAR TICKET"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    if [ -z "$TICKET_ID" ]; then
        echo -e "${YELLOW}⚠ Aviso: ID do ticket não está definido. Use o TESTE 5 para criar um.${NC}"
        return
    fi

    print_subsection "PATCH /tickets/{id}"
    echo "Atualizando ticket: $TICKET_ID"

    local payload='{
        "name": "Bug no Sistema de Login - CRÍTICO",
        "status": 2,
        "priority": 4
    }'

    echo -e "${CYAN}Payload:${NC}"
    echo "$payload" | jq '.' 2>/dev/null || echo "$payload"
    echo ""

    local response=$(make_request "PATCH" "/tickets/$TICKET_ID" "$payload" true)
    print_response "Update Ticket" "$response"
}

test_delete_ticket() {
    print_section "🎫 TESTE 10: DELETAR TICKET"

    if [ -z "$TOKEN" ]; then
        echo -e "${RED}✗ Erro: Token não está definido. Faça login primeiro.${NC}"
        return
    fi

    if [ -z "$TICKET_ID" ]; then
        echo -e "${YELLOW}⚠ Aviso: ID do ticket não está definido. Use o TESTE 5 para criar um.${NC}"
        return
    fi

    print_subsection "DELETE /tickets/{id}"
    echo "Deletando ticket: $TICKET_ID"
    echo ""

    local response=$(make_request "DELETE" "/tickets/$TICKET_ID" "" true)
    print_response "Delete Ticket" "$response"

    echo -e "${GREEN}✓ Ticket deletado com sucesso!${NC}"
    TICKET_ID=""
}

# ============================================================================
# EXEMPLOS DE REQUISIÇÕES cURL PRONTAS
# ============================================================================

print_curl_examples() {
    print_section "📋 EXEMPLOS DE REQUISIÇÕES cURL"

    echo -e "${CYAN}1. Registrar novo usuário:${NC}"
    cat << 'EOF'
curl -X POST "http://localhost:8000/api/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123456"
  }'
EOF

    echo ""
    echo -e "${CYAN}2. Fazer login:${NC}"
    cat << 'EOF'
curl -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'
EOF

    echo ""
    echo -e "${CYAN}3. Obter usuário atual (requer token):${NC}"
    cat << 'EOF'
curl -X GET "http://localhost:8000/api/me" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Accept: application/json"
EOF

    echo ""
    echo -e "${CYAN}4. Criar novo ticket (requer token):${NC}"
    cat << 'EOF'
curl -X POST "http://localhost:8000/api/tickets" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Título do Ticket",
    "subject": "Assunto",
    "description": "Descrição detalhada",
    "status": 1,
    "priority": 3
  }'
EOF

    echo ""
    echo -e "${CYAN}5. Listar tickets paginados (requer token):${NC}"
    cat << 'EOF'
curl -X GET "http://localhost:8000/api/tickets-paginated?page=1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Accept: application/json"
EOF

    echo ""
    echo -e "${CYAN}6. Atualizar ticket (requer token):${NC}"
    cat << 'EOF'
curl -X PATCH "http://localhost:8000/api/tickets/TICKET_HASH" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": 2,
    "priority": 4
  }'
EOF

    echo ""
    echo -e "${CYAN}7. Deletar ticket (requer token):${NC}"
    cat << 'EOF'
curl -X DELETE "http://localhost:8000/api/tickets/TICKET_HASH" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Accept: application/json"
EOF

    echo ""
    echo -e "${CYAN}8. Logout (requer token):${NC}"
    cat << 'EOF'
curl -X POST "http://localhost:8000/api/logout" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Accept: application/json"
EOF
}

# ============================================================================
# MENU INTERATIVO
# ============================================================================

print_menu() {
    clear
    echo -e "${BLUE}"
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║  Ticket Management API - Script de Testes cURL                ║
║  v1.0 - Abril 2026                                            ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo "Base URL: $BASE_URL"
    if [ -n "$TOKEN" ]; then
        echo -e "Status: ${GREEN}✓ Autenticado${NC}"
        echo "Token: ${TOKEN:0:30}..."
    else
        echo -e "Status: ${RED}✗ Não autenticado${NC}"
    fi
    echo ""
    echo -e "${YELLOW}═════════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}AUTENTICAÇÃO${NC}"
    echo -e "  1) Registrar novo usuário"
    echo -e "  2) Fazer login"
    echo -e "  3) Obter usuário atual"
    echo -e "  4) Logout"
    echo ""
    echo -e "${YELLOW}TICKETS${NC}"
    echo -e "  5) Criar novo ticket"
    echo -e "  6) Listar todos os tickets"
    echo -e "  7) Listar tickets (paginado)"
    echo -e "  8) Obter ticket específico"
    echo -e "  9) Atualizar ticket"
    echo -e " 10) Deletar ticket"
    echo ""
    echo -e "${YELLOW}UTILITÁRIOS${NC}"
    echo -e " 11) Ver exemplos de requisições cURL"
    echo -e " 12) Executar teste completo (fluxo)"
    echo -e "  0) Sair"
    echo -e "${YELLOW}═════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

interactive_menu() {
    while true; do
        print_menu
        read -p "Escolha uma opção: " choice

        case $choice in
            1) test_register ;;
            2) test_login ;;
            3) test_get_current_user ;;
            4) test_logout ;;
            5) test_create_ticket ;;
            6) test_get_all_tickets ;;
            7) test_get_tickets_paginated ;;
            8) test_get_single_ticket ;;
            9) test_update_ticket ;;
            10) test_delete_ticket ;;
            11) print_curl_examples ;;
            12)
                test_register
                test_login
                test_create_ticket
                test_get_all_tickets
                test_get_tickets_paginated
                test_get_single_ticket
                test_update_ticket
                test_delete_ticket
                ;;
            0)
                echo "Saindo..."
                exit 0
                ;;
            *)
                echo -e "${RED}Opção inválida. Tente novamente.${NC}"
                ;;
        esac

        echo ""
        read -p "Pressione ENTER para continuar..."
    done
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Se passou argumentos, executar em modo não-interativo
    if [ $# -gt 0 ]; then
        case $1 in
            test)
                test_register
                test_login
                test_create_ticket
                test_get_all_tickets
                test_get_single_ticket
                test_update_ticket
                test_delete_ticket
                ;;
            examples)
                print_curl_examples
                ;;
            *)
                echo "Uso: $0 [test|examples|]"
                echo "  test      - Executar todos os testes"
                echo "  examples  - Mostrar exemplos de requisições"
                echo "  (sem argumentos) - Menu interativo"
                exit 1
                ;;
        esac
    else
        # Menu interativo
        interactive_menu
    fi
}

# Executar main
main "$@"

