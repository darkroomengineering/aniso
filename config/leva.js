const theme = {
  colors: {
    elevation1: '#F2F2F2', // bg color of the root panel (main title bar)
    elevation2: '#121212', // bg color of the rows (main panel color)
    elevation3: '#f2f2f2', // bg color of the inputs
    accent1: '#F2F2F2',
    accent2: 'var(--blue)',
    accent3: 'var(--blue)',
    highlight1: '$accent1',
    highlight2: '$accent1',
    highlight3: '#fefefe',
    vivid1: '#ffcc00',
    folderWidgetColor: '$highlight3',
    folderTextColor: '$highlight3',
    toolTipBackground: '$highlight3',
    toolTipText: '$elevation2',
  },
  radii: {
    xs: '4px',
    sm: '4px',
    lg: '3px',
  },
  space: {
    xs: '0px',
    sm: '0px',
    md: '0px',
    rowGap: '16px',
    colGap: '16px',
  },
  fonts: {
    mono: `'NON Natural Mono', ui-monospace, SFMono-Regular, Menlo, 'Roboto Mono', monospace`,
    sans: `system-ui, sans-serif`,
  },
  fontSizes: {
    root: '9px',
    toolTip: '$root',
  },
  sizes: {
    rootWidth: '280px',
    controlWidth: '178px',
    numberInputMinWidth: '32px',
    scrubberWidth: '12px',
    scrubberHeight: '20px',
    rowHeight: '20px',
    folderTitleHeight: '20px',
    checkboxSize: '20px',
    joystickWidth: '100px',
    joystickHeight: '100px',
    colorPickerWidth: '$controlWidth',
    colorPickerHeight: '100px',
    imagePreviewWidth: '$controlWidth',
    imagePreviewHeight: '100px',
    monitorHeight: '60px',
    titleBarHeight: '39px',
  },
  shadows: {
    level1: 'unset',
    level2: 'unset',
  },
  borderWidths: {
    root: '0px',
    input: '0px',
    focus: '0px',
    hover: '0px',
    active: '0px',
    folder: '0px',
  },
  fontWeights: {
    label: 'normal',
    folder: 'normal',
    button: 'normal',
  },
}

export default theme
