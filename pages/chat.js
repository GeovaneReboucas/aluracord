import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

export default function ChatPage() {

    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            id: listaDeMensagens.length + 1,
            de: 'VanessaMelo',
            texto: novaMensagem,
        }

        setListaDeMensagens([
            mensagem,
            ...listaDeMensagens,
        ]);
        setMensagem('');
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[200],
                backgroundImage: `url(https://www.mheda.org/wp-content/uploads/2021/12/76dcafc26efcb4fd9cc77292fce442be.png)`,
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
                            alignItems: 'center',
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
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
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
                    label='Logout'
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
                                src={`https://github.com/vanessametonini.png`}
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