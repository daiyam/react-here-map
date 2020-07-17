import React from "react"
import PropTypes from "prop-types"
import merge from "lodash.merge"
import initMapObjectEvents from "../../../libs/initMapObjectEvents"

class Marker extends React.Component {
  constructor(props) {
    super(props)
    this.marker = null
  }

  componentDidUpdate(prevProps) {
    // update the lat and lng when it changes
    if (this.props.coords.lat !== prevProps.coords.lat || this.props.coords.lng !== prevProps.coords.lng) this.updatePosition()
  }

  componentWillUnmount() {
    const { map } = this.props

    if (!map || !map.removeObject) return
    
    this.marker && map.removeObject(this.marker)
  }

  createMarker() {
    const {
      icon,
      map,
      coords,
      type,
      options,
      setViewBounds,
      updateMarker,
      marker,
      getMarker,
      objectEvents,
      platform,
      ui,
      draggable,
      __options
    } = merge(
      { setViewBounds: true, updateMarker: false, marker: null, getMarker() { } },
      this.props
    )
    let _options = options
    if (!H || !H.map || !map) {
      throw new Error("HMap has to be initialized before adding Map Objects")
    }

    if (!coords.lat || !coords.lng) {
      throw new Error(
        "coords should be an object having 'lat' and 'lng' as props"
      )
    }

    if (type && type === "DOM") {
      // Displays a DOM Icon
      _options.icon = new H.map.DomIcon(icon)
    } else if (type) {
      // Displays a static icon
      _options.icon = new H.map.Icon(icon)
    }

    // Create an icon, an object holding the latitude and longitude, and a marker:
    const _marker =
      updateMarker && marker ? marker : new H.map.Marker(coords, _options)

    if (draggable) {
      _marker.draggable = true
    }

    initMapObjectEvents(_marker, objectEvents, __options)

    map.addObject(_marker)

    this.marker = _marker
    
    // Send the marker to the parent
    !marker ? getMarker(this.marker) : null;

    // Centers the marker
    setViewBounds ? map.setCenter(coords) : null;
  };

  updateMarker() {
    const { coords, map, marker, getMarker = () => {}, setViewBounds = true } = this.props
    
    this.marker.setPosition(coords)
    
     // Send the marker to the parent
    !marker ? getMarker(this.marker) : null;

    // Centers the marker
    setViewBounds ? map.setCenter(coords) : null;
  };

  updatePosition() {
    this.marker.setPosition(this.props.coords)
  };

  render() {
    const { map } = this.props
    if (map && map.addObject && !this.marker) {
      this.createMarker()
    } else if (this.marker) {
      this.updateMarker()
    }
    return null
  }
}

Marker.propTypes = {
  coords: PropTypes.object.isRequired,
  icon: PropTypes.any,
  options: PropTypes.object,
  type: PropTypes.string,
  setViewBounds: PropTypes.bool,
  map: PropTypes.object,
  objectEvents: PropTypes.object
}

export default Marker
