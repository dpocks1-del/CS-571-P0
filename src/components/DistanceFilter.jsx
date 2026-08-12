import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function DistanceFilter({ min, max, value, onChange }) {
  // Don't render a slider if there's no meaningful range yet (e.g. no local listings)
  if (min === max) return null

  return (
    <div className="mt-2">
      <label className="form-label">Max distance: {value} mi</label>
      <Slider
        min={min}
        max={max}
        value={value}
        onChange={(val) => onChange(val)}
      />
    </div>
  )
}