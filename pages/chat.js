import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

import NProgress from "nprogress";

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL_KEY}.supabase.co`;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {

    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    //Perceba que abaixo, a aplicação está pegando os dados do banco apenas uma vez, quando é iniciado.
    //Ao digitar uma nova mensagem, ela é adicionada ao BD e ao array do useState.
    React.useEffect(() => {
        NProgress.start();
        supabaseClient
            .from("mensagens")
            .select('*')
            .order('id', { ascending: false })
            .then(( {data} ) => {
                // console.log('Dados da consulta: ', data);
                setListaDeMensagens(data);
                NProgress.done();
            });
    }, []);

    function handleNovaMensagem(novaMensagem) {
        if (!(novaMensagem === "")) {
            const mensagem = {
                // id: listaDeMensagens.length + 1,
                de: 'omariosouto',
                texto: novaMensagem,
            }

            supabaseClient
                .from('mensagens')
                .insert([
                    //É necessário que o objeto tenha os mesmos campos que o BD
                    mensagem
                ]).then(( {data} ) => {
                    // console.log("RESPOSTA DA CRIAÇÃO: ", data);

                    setListaDeMensagens([
                        data[0],
                        ...listaDeMensagens,
                    ]);
                });
            setMensagem('');
        }
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[200],
                backgroundImage: 'url(/bgAbstract.png)',
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
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
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

                    <MessageList mensagens={listaDeMensagens} />
                    {/* {listaDeMensagens.map((item) => {
                        return (
                            <li key={item.id}>
                                {item.de}: {item.texto}
                            </li>
                        )
                    })} */}

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
                                borderRadius: '5px',
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
                                height: '85%',
                                // padding: '10px 12px'
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.custom[200],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.custom[300],
                            }}
                            onClick={() => handleNovaMensagem(mensagem)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Sair'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log('MessageList', props.mensagens);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.mensagens.map((itemMensagem) => {
                return (
                    <Text
                        key={itemMensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${itemMensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {itemMensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {itemMensagem.texto}
                    </Text>

                );
            })}

        </Box>
    )
}