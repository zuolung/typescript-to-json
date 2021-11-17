### typescript-to-json

Analysis of the d.ts file, collect the first level of property description
It can be applied to DTS conversion to document API description

### install

```
npm i typescript-to-json --dev
```

### demo

```js
const parse = require("typescript-to-json");

console.info(
  parse(`import { ComponentClass } from 'react'
  import { PickerProps, IPickerInstance } from './picker'

  type IAnyObjectString = {
    [x: number | string]: string
  }

  /**
   * @desc API
   */
  export interface AreaProps
    extends Omit<PickerProps, 'columns' | 'onChange'>,
      ComponentClass {
    /**
     * @default
     * @desc    value of address
     */
    value?: string
    areaList?: {
      province_list: IAnyObjectString
      city_list: IAnyObjectString
      county_list: IAnyObjectString
    }
    /**
     * @desc count of columns
     */
    columnsNum?: string | number
    /**
     * @desc placeholder of columns
     */
    columnsPlaceholder?: string[]
    /**
     * @desc trigger function
     */
    onChange: (event: {
      detail: {
        values: number[] | string[]
        picker: IPickerInstance
        index: number
      }
    }) => void
  }
  declare const Area: ComponentClass<AreaProps>

  export { Area }
  `)
);
```

get the result, Only analyze the type description of Export Exposure;
'value' and 'require' come from code analysis, others come from comments

```
{
  AreaProps: {
    value: {
      default: '',
      desc: 'value of address',
      require: 'false',
      value: '  string\n\n'
    },
    areaList: {
      require: 'false',
      value: '  {\n' +
        '    province_list: IAnyObjectString\n' +
        '    city_list: IAnyObjectString\n' +
        '    county_list: IAnyObjectString\n' +
        '  }\n' +
        '\n'
    },
    columnsNum: {
      desc: 'count of columns',
      require: 'false',
      value: '  string | number\n\n'
    },
    columnsPlaceholder: {
      desc: 'placeholder of columns',
      require: 'false',
      value: '  string[]\n\n'
    },
    onChange: {
      desc: 'trigger function',
      require: 'true',
      value: '  (event: {\n' +
        '    detail: {\n' +
        '      values: number[] | string[]\n' +
        '      picker: IPickerInstance\n' +
        '      index: number\n' +
        '    }\n' +
        '  }) => void\n' +
        '\n'
    }
  }
}
```
