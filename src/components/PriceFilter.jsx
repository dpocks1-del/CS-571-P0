import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function PriceFilter({ min, max, value, onChange }) {
  // Don't render a slider if there's no meaningful range yet (e.g. items still loading)
  if (min === max) return null

  return (
    <div className="mb-3">
      <label className="form-label">
        Price: ${value[0]} – ${value[1]}
      </label>
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={(val) => onChange(val)}
        allowCross={false}
      />
    </div>
  )
}