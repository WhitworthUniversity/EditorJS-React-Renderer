# [EditorJS-React Renderer (ERR)](https://err.bomdisoft.com/)

[View live example](https://err.bomdisoft.com/)

[![](https://flat.badgen.net/npm/v/editorjs-react-renderer?icon=npm)](https://www.npmjs.com/package/editorjs-react-renderer)
![npm](https://img.shields.io/npm/dw/editorjs-react-renderer)
[![](https://flat.badgen.net/npm/license/editorjs-react-renderer)](https://www.npmjs.com/package/editorjs-react-renderer)

A library for rendering styled, responsive and flexible React components from [block style](https://editorjs.io/saving-data) data objects like those generated by codex editors like [Editor.js](https://editorjs.io/).

This package works well with output from the Editor.js rich text editor library.
However, there is no dependency on Editor.js. We only require that your data is in a similar block style format.

## 💗 If you like this package 💗

Support us on Patreon

 👉  [https://www.patreon.com/devjuju](https://www.patreon.com/devjuju)

## Setup

Install the package via NPM

```shell
npm i editorjs-react-renderer
```

Install peer dependencies if you don't already have them in your project

```shell
npm i react prop-types
```

CDN usage will be available soon...

Add to your module/application

```javascript
import Output from 'editorjs-react-renderer';
OR
const Output = require('editorjs-react-renderer');
```

**Output** accepts a block style data object as prop

```javascript
const data = {
  "time": 1564767102436,
  "blocks": [
    {
      "type" : "header",
      "data" : {
        "level" : 4,
        "text" : "Editor.js React Renderer"
      }
    },
    {
      "type": "image",
      "data": {
        "file": {
          "url": "https://cdn1.imggmi.com/uploads/2019/8/24/fdbf3465641e401ebe0ec58d278656d1-full.jpg"
        },
        "caption": "Test Caption",
        "withBorder": false,
        "stretched": false,
        "withBackground": false
      }
    },
    {
      "type": "paragraph",
      "data": {
        "text": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque accusantium veritatis dolorum cum amet! Ipsa ullam nisi, dolor explicabo ut nobis repudiandae saepe illo error facilis consectetur, quisquam assumenda dolorum."
      }
    },
    ...
  ],
  "version": "2.14.0"
};
```

*The **time** and **version** properties are not required. Only the **blocks** array is required*

Notice that your block data can also be HTML markup.

Pass your block style data to **Output()** and ERR will take care of the rest :)

```javascript
const Post = () => <section><Output data={ data } /></section>;

export default Post;
```

Each object in the *blocks* property of your block style data is converted to a responsive, styled React component.

**Output()** accepts a style prop through which you can add custom style to the supported components.

See the [Style](#style) section for more


## Render Single Block

Sometimes you might want to render just a single component like a paragraph or header. While this is possible with the **Output** component, you should consider using one of the more specific block output components.

```javascript
import { ListOutput } from 'editorjs-react-renderer';

const listData = {
  "items" : ["Item one", "Another item", "Item 3"],
  "style" : "unordered" // ordered or unordered
};

// Your custom style will be merged with the defaults, with yours as priority
const listStyle = {
  textAlign: 'left'
};

const Todo = () => <ListOutput data={ listData } style={ style } />;

export default Todo;
```

See the [API](#api) section for more block output components


## Custom Renderers

We provide several granular styling options so that you have the ability and flexibility to customize the look and feel of the rendered components.
However, you might still have a need to override the default renderers for certain blocks.
You can do that by passing a *renderers* prop to the **Output** component. The renderers prop is an object whose keys are the names of the supported components and whose values are the corresponding renderer definitions to override the defaults.
Custom renderers should expect to receive *data*, *style*, *classNames* and *config* props.

```javascript
// Define your custom renderer
// It should expect to receive data, style, classNames and config props. It's up to you to handle those props.
const CustomParagraphRenderer = ({ data, style, classNames, config }) => {
  // validate props here...or not :)

  let content = null;

  if (typeof data === 'string') content = data;
  else if (typeof data === 'object' && data.text && typeof data.text === 'string') content = data.text;

  return content ? <p style={ style } className={ classNames }>{ ReactHtmlParser(content) }</p> : '';
};

const renderers = {
  paragraph: CustomParagraphRenderer
};

const Todo = () => <Output renderers={ renderers } data={...} style={...} classNames={...} config={...} />;

export default Todo;
```


## Style
You can use inline and/or className styling to change the default look and feel of all supported components
The following examples will show you how to use both

```javascript
import { HeaderOutput, ParagraphOutput } from 'editorjs-react-renderer';

const data = {
  header: {...},
  paragraph: {...}
};

// All valid JSX inline styles are allowed
const style = {
  header: {
    textAlign: 'left',
    margin: '10px 20px',
  },
  paragraph: {
    fontSize: '16px',
  }
};

const classes = {
  header: 'header-class1 header-class2',
  paragraph: 'paragraph-class',
};

const Post = () => (
  <section>
    <HeaderOutput data={ data.header } style={ style.header } classNames={ classes.header } />
    <ParagraphOutput data={ data.paragraph } style={ style.paragraph } classNames={ classes.paragraph } />
  </section>
);

export default Post;
```

Most components have sub-components which can also be styled separately

```javascript
import { ImageOutput } from 'editorjs-react-renderer';

const image = {...};

// All valid JSX inline styles are allowed
const style = {
  image: {
    img: {
      maxHeight: '400px',
    },
    figure: {...},
    figcaption: {...}
  },
};

const classes = {
  image: {
    img: 'img-class',
    figure: 'figure-c',
    figcaption: 'someClassName'
  },
};

const Post = () => (
  <section>
    <ImageOutput data={ image } style={ style.image } classNames={ classes.image } />
  </section>
);

export default Post;
```

You can also pass these styles through the **Output** component.
In this case, the style prop must be an object whose keys correspond to the names of the supported blocks you intend to style.
The following example highlights the current possible nestings and keys for the supported block.

**NB** If you prefer classes, remember the keys are the same but the values must be class names (strings NOT objects) and the prop name should be classNames

```javascript
// All valid JSX inline styles are allowed
const style = {
  header: {...},
  image: {
    img: {...},
    figure: {...},
    figcaption: {...}
  },
  video: {
    video: {...},
    figure: {...},
    figcaption: {...}
  },
  embed: {
    video: {...},
    figure: {...},
    figcaption: {...}
  },
  paragraph: {...},
  list: {
    container: {...},
    listItem: {...},
  },
  checklist: {
    container: {...},
    item: {...},
    checkbox: {...},
    label: {...},
  },
  table: {
    table: {...},
    tr: {...},
    th: {...},
    td: {...},
  },
  quote: {
    container: {...},
    content: {...},
    author: {...},
    message: {...}
  },
  codeBox: {
    container: {...},
    code: {...},
  },
  warning: {
    container: {...},
    icon: {...},
    title: {...},
    message: {...},
  },
  delimiter: {
    container: {...},
    svg: {...},
    path: {...}
  },
};

const Post = () => <section><Output data={ data } style={ style } /></section>;

export default Post;
```


## Config

All renderers accept a **config** object parameter. If you wish to disable a default styles and only apply your own, you can pass a **disableDefaultStyle** value of **true** to the element's config options

```javascript
const config = {
  header: {
    disableDefaultStyle: true,
  },
  image: {
    disableDefaultStyle: true,
  },
  video: {
    disableDefaultStyle: true,
  },
};

const Post = () => <section><Output data={ data } style={ style } config={ config } /></section>;

export default Post;
```


## Server Side Rendering

There is full support for SSR


## API

### Components/Functions

* Output(data[,style])
* CodeBoxOutput(data[,style])
* HeaderOutput(data[,style])
* ParagraphOutput(data[,style])
* TableOutput(data[,style])
* ImageOutput(data[,style])
* VideoOutput(data[,style])
* EmbedOutput(data[,style])
* ListOutput(data[,style])
* ChecklistOutput(data[,style])
* QuoteOutput(data[,style])
* WarningOutput(data[,style])
* DelimiterOutput([,style])


## Supported blocks/components
* [CodeBox](https://github.com/BomdiZane/codebox)
* [Header](https://github.com/editor-js/header)
* [Paragraph](https://github.com/editor-js/paragraph)
* [Image](https://github.com/editor-js/image)
* [Video](https://github.com/PaulKinlan/simple-video)
* [Embed](https://github.com/editor-js/embed)
* [List](https://github.com/editor-js/list)
* [Checklist](https://github.com/editor-js/checklist)
* [Table](https://github.com/editor-js/table)
* [Quote](https://github.com/editor-js/quote)
* [Warning](https://github.com/editor-js/warning)
* [Delimiter](https://github.com/editor-js/delimiter)

There's more coming...


## Author

Dev Juju (Bomdi)

[Website](https://devjuju.com)
[LinkedIn](http://www.linkedin.com/in/adombangmunang)
