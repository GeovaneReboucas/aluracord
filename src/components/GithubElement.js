import { Box, Text } from '@skynexui/components';
import appConfig from '../../config.json';

export function GithubElement({ children, infoTitle }) {
    return (
        <Box styleSheet={{
            width: '100%', display: 'flex', justifyContent: 'center'
        }}>
            <Text variant='body4' styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
            }}>
                <Text variant='body4' styleSheet={{ fontWeight: '700' }}>
                {infoTitle}:
                </Text> 
                {children} 
            </Text>
        </Box>
    );
}