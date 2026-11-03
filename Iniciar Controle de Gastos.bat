@echo off
title Meu Caixa - Servidor e Banco de Dados SQLite
cd /d "C:\Controle de Gastos"
echo Iniciando Banco de Dados SQLite em C:\Controle de Gastos\banco_de_dados.sqlite ...
start "" "http://localhost:3333"
node "C:\Controle de Gastos\server.js"
pause
