import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface ProxiedImageProps extends BoxProps {
  src: string;
  alt?: string;
}

const getProxiedImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`;
  }
  return url;
};

const ProxiedImage: React.FC<ProxiedImageProps> = ({ src, alt = '', ...props }) => (
  <Box component="img" src={getProxiedImageUrl(src)} alt={alt} {...props} />
);

export default ProxiedImage;
