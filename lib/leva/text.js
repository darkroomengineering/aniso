import { Components, createPlugin, useInputContext } from 'leva/plugin'

const { Label, Row, String } = Components

function Text() {
  const {
    label,
    value,
    displayValue,
    settings,
    onUpdate,
    onChange,
    setSettings,
  } = useInputContext()

  return (
    <Row input>
      <Label>{label}</Label>
      <String
        displayValue={displayValue}
        onUpdate={onUpdate}
        onChange={(e) => {
          onUpdate(e)
          onChange(e)
        }}
      />
    </Row>
  )
}

export const text = createPlugin({
  component: Text,
})
