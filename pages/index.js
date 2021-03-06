import React from 'react';
import { useRouter } from 'next/router';


import appConfig from '../config.json';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import { GithubElement } from '../src/components/GithubElement';

import NProgress from "nprogress";

function Titulo(props) {
    const Tag = props.tag || 'h1';

    return (
        <>
            <Tag>{props.children}</Tag>

            <style jsx>
                {`
                    ${Tag}{
                        color: ${appConfig.theme.colors.neutrals['000']};
                        font-size: 24px;
                        font-weight: 600;
                    }
                `}
            </style>
        </>
    );
}

export default function PaginaInicial() {
    const [username, setUsername] = React.useState('');
    const [errorUser, setErrorUser] = React.useState();
    const [data, setData] = React.useState({ followers: 0, repositories: 0, location: '' });
    const roteamento = useRouter();
    var initial;
    // console.log(roteamento);

    React.useEffect(() => {
        NProgress.start();
        NProgress.done()
    }, []);

    const validData = async (user) => {

        if (user.length > 2) {
            
            clearTimeout(initial);
            setUsername(user);

            initial = setTimeout(() => {
                
                if(errorUser !== 403){ 
                    return fetch(`https://api.github.com/users/${user}`, {
                        method: 'GET'
                    }).then(async (res) => {
                        if (res.status === 200) {
                            let dados = await res.json();
                            // console.log("DADOS", dados);
                            setErrorUser(200);
                            setData({ 
                                followers: dados.followers, 
                                repositories: dados.public_repos,
                                location: dados.location
                            });
                        }else if(res.status === 403){//error api limit
                            console.log("API LIMITE");
                            setErrorUser(403);
                        }else{
                            setErrorUser(404);
                        }
                    });
                }
            }, 1500);
        }else{
            setUsername('');
            setErrorUser(404);
        }
    }
    

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    backgroundColor: appConfig.theme.colors.primary['000'],
                    backgroundImage: 'url(/images/estrelas.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '5px', padding: '32px', 
                        margin: '0 16px',
                        boxShadow: '0 0 10px 3px rgb(0 0 0 / 40%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                        // opacity:'0.97'
                    }}
                >
                    {/* Formul??rio */}
                    <Box
                        as="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            roteamento.push(`/chat?username=${username}`);
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Boas vindas de volta!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            // value={username}
                            onChange={(e) => {
                                validData(e.target.value);
                            }}
                            placeholder='Insira seu username do Github'
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals['200'],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.custom[200],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            disabled={!username}
                            fullWidth
                            styleSheet={{
                                borderRadius: '15px 0px'
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.custom[200],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.custom[300],
                            }}
                        />
                    </Box>
                    {/* Formul??rio */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        {username ? (
                            <>
                                <Image
                                    styleSheet={{
                                        borderRadius: '50%',
                                        marginBottom: '16px',
                                        transition: '0.5s'
                                    }}
                                    src={`https://github.com/${username}.png`}
                                />

                                <Text
                                    variant="body4"
                                    styleSheet={{
                                        color: appConfig.theme.colors.neutrals[200],
                                        backgroundColor: appConfig.theme.colors.neutrals[900],
                                        padding: '3px 10px',
                                        borderRadius: '1000px'
                                    }}
                                >
                                    {username}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Image
                                    styleSheet={{
                                        height: '8rem',
                                        borderRadius: '10%',
                                        marginBottom: '16px',
                                        transition: '0.6s'
                                    }}
                                    // src={'/images/eve.webp'}
                                    src={'/images/eve2.webp'}
                                />
                                <Text
                                    variant="body4"
                                    styleSheet={{
                                        color: appConfig.theme.colors.neutrals[200],
                                        backgroundColor: appConfig.theme.colors.neutrals[900],
                                        padding: '3px 10px',
                                        borderRadius: '1000px'
                                    }}
                                >
                                    Aluracord
                                </Text>
                            </>
                        )}
                    </Box>
                    {/* Photo Area */}
                </Box>

                {/* github informations */}
                {errorUser === 200 &&
                    <>
                        <Box styleSheet={{
                            width: '100%', maxWidth: '700px', padding: '20px',
                            display: 'flex', borderTop: `2px solid ${appConfig.theme.colors.neutrals[800]}`,
                            backgroundColor: appConfig.theme.colors.neutrals[700]
                        }}>
                            <GithubElement infoTitle="Seguidores"> {data.followers}</GithubElement>
                            <GithubElement infoTitle="Reposit??rios"> {data.repositories}</GithubElement>
                            <GithubElement infoTitle="Localiza????o"> {data.location}</GithubElement>
                        </Box>
                    </>
                }

            </Box>
        </>
    );
}