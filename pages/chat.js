import { Box, TextField, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { Header } from '../src/components/Header';
import { MessageList } from '../src/components/MessageList';

import NProgress from "nprogress";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL_KEY}.supabase.co`;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function mensagemTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        }).subscribe();
}

function deleteTempoReal(deletaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('DELETE', ({old}) => {
            deletaMensagem(old.id);
        });
}



export default function ChatPage() {

    const roteamento = useRouter();
    const usuario = roteamento.query.username;

    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    //Perceba que abaixo, a aplicação está pegando os dados do banco apenas uma vez, quando é iniciado.
    //Ao digitar uma nova mensagem, ela é adicionada ao BD e ao array do useState.
    React.useEffect(() => {
        NProgress.start();
        NProgress.set(0.45);
        supabaseClient
            .from("mensagens")
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                // console.log('Dados da consulta: ', data);
                setListaDeMensagens(data);
                NProgress.done();
            });

        mensagemTempoReal((novaMensagem) => {
            // console.log("NOVA MENSAGEM ESCUTADA: ",novaMensagem);
            NProgress.start();
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
            NProgress.done();
        });

        deleteTempoReal((oldId) => {
            NProgress.start();
            setListaDeMensagens((MessageList) => {
                return MessageList.filter((message) => message.id !== oldId)
            });
            NProgress.done();
        });

    }, []);

    function handleNovaMensagem(novaMensagem) {
        if (!(novaMensagem === "")) {
            const mensagem = {
                // id: listaDeMensagens.length + 1,
                de: usuario.toLowerCase(),
                texto: novaMensagem,
            }

            supabaseClient
                .from('mensagens')
                .insert([
                    //É necessário que o objeto tenha os mesmos campos que o BD
                    mensagem
                ])
                .then(({ data }) => {
                    // console.log("RESPOSTA DA CRIAÇÃO: ", data);
                });
            setMensagem('');
        }
    }

    function deleteMessage(messageId) {
        supabaseClient
            .from('mensagens')
            .delete()
            .match({ id: messageId })
            .then(({ data }) => {
            })
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary['000'],
                backgroundImage: 'url(/images/estrelas.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '93%',
                    maxHeight: '93vh',
                    padding: '32px'
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList
                        mensagens={listaDeMensagens}
                        delete={deleteMessage}
                        user={usuario}
                    />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            // alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}

                            //pegar o valor do campo
                            onChange={(e) => {
                                setMensagem(e.target.value);
                            }}

                            //capturar a tecla
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                resize: 'none',
                                borderRadius: '10px 0',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                            textFieldColors={{
                                neutral: {
                                    mainColorHighlight: appConfig.theme.colors.custom[200],
                                }
                            }}
                        />
                        <Button
                            label='Enviar'
                            styleSheet={{
                                height: '75%',
                                marginRight: '12px',
                                borderRadius: '10px 0'
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.custom[200],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.custom[300],
                            }}
                            onClick={() => handleNovaMensagem(mensagem)}
                        />

                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNovaMensagem(`:sticker:${sticker}`);
                            }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

