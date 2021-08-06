// Custom rendered for urlImage
// Modified from image components


//#region imports
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import imageOutputStyle from './style';
//#endregion

const supportedKeys = [ 'img', 'figure', 'figcaption'];

const UrlImageOutput = ({ data, style, classNames, config }) => {
  if (!data || !data.url) return '';
  if (!style || typeof style !== 'object') style = {};
  if (!config || typeof config !== 'object') config = {};
  if (!classNames || typeof classNames !== 'object') classNames = '';

  supportedKeys.forEach(key => {
    if (!style[key] || typeof style[key] !== 'object') style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== 'string') classNames[key] = '';
  });

  const imageStyle = config.disableDefaultStyle ? style.img : { ...imageOutputStyle.imageStyle, ...style.img };
  imageStyle.width = data.stretched ? '100%' : '';

  const figureStyle = config.disableDefaultStyle ? style.figure : { ...imageOutputStyle.figureStyle, ...style.figure };

  if (!data.withBorder) figureStyle.border = 'none';
  if (!data.withBackground) figureStyle.backgroundColor = 'none';

  const figcaptionStyle = config.disableDefaultStyle ? style.figcaption : { ...imageOutputStyle.figcaptionStyle, ...style.figcaption };

  return (
    <figure style={ figureStyle } className={ classNames.figure }>
      <img src={ data.url } alt={ data.caption || '' } style={ imageStyle } className={ classNames.img } />
      { data.caption && <figcaption style={ figcaptionStyle } className={ classNames.figcaption }>{ ReactHtmlParser(data.caption) }</figcaption> }
    </figure>
  );
};

export default UrlImageOutput;
