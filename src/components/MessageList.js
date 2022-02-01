import { Box, Text, Image, Button } from '@skynexui/components';
import appConfig from '../../config.json';

export function MessageList(props) {

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                wordBreak: 'break-word',
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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: (props.user).toLowerCase() === itemMensagem.de ? 'flex-end' : 'flex-start',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                styleSheet={{
                                    marginRight: '1.5rem'
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

                            {(props.user).toLowerCase() === itemMensagem.de &&
                                <Button
                                    variant='tertiary'
                                    colorVariant='neutral'
                                    onClick={() => props.delete(itemMensagem.id)}
                                    label='X'
                                    styleSheet={{
                                        height: '1.9rem',
                                        width: '1.9rem'
                                    }}
                                    buttonColors={{
                                        contrastColor: appConfig.theme.colors.neutrals["000"],
                                        mainColor: appConfig.theme.colors.custom['000'],
                                        mainColorLight: appConfig.theme.colors.custom['500'],
                                        mainColorStrong: appConfig.theme.colors.custom['500']
                                    }}
                                />
                            }
                        </Box>

                        {/* ternário abaixo para verificar se foi adicionado um sticker*/}
                        {itemMensagem.texto.startsWith(':sticker:') ? (
                            <Image
                                src={itemMensagem.texto.replace(':sticker:', '')}
                                styleSheet={{
                                    width: {
                                        xs: '200px',
                                        sm: '290px',
                                    },
                                    height: '240px'
                                }}
                            />
                        ) : (
                            itemMensagem.texto
                        )}

                    </Text>

                );
            })}

        </Box>
    )
}