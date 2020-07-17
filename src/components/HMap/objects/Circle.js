import React from "react"
import PropTypes from "prop-types"
import merge from "lodash.merge"
import initMapObjectEvents from "../../../libs/initMapObjectEvents"

class Circle extends React.Component {
  constructor(props) {
    super(props)
    this.cirle = null
  }

  componentDidUpdate(prevProps) {
    // update the lat and lng when it changes
    if (this.props.coords.lat !== prevProps.coords.lat || this.props.coords.lng !== prevProps.coords.lng) this.updatePosition()
  }

  componentWillUnmount() {
    const { map } = this.props

    if (!map || !map.removeObject) return

    this.cirle && map.removeObject(this.cirle)
  }

  createCircle() {
    const {
      radius,
      map,
      coords,
      options,
      setViewBounds,
      objectEvents,
      platform,
      ui,
      __options
    } = merge({ setViewBounds: true }, this.props)
    if (!H || !H.map || !map) {
      throw new Error("HMap has to be initialized before adding Map Objects")
    }

    if (!coords.lat || !coords.lng) {
      throw new Error(
        "coords should be an object having 'lat' and 'lng' as props"
      )
    }

    if (!radius) {
      console.info("radius is not set, default radius of 1000 is used")
    }

    const circle = new H.map.Circle(
      // The central point of the circle
      coords,
      // The radius of the circle in meters
      radius || 1000,
      options
    )

    // Add event listener to the object if intention of using the object is defined
    initMapObjectEvents(circle, objectEvents, __options)

    map.addObject(circle)

    this.circle = circle

    // Centers the circle
    if (setViewBounds) {
      map.setCenter(coords)
    }
  };

  updateCircle() {
    const { coords, map, setViewBounds = true } = this.props

    this.circle.setCenter(coords)

    // Centers the circle
    if (setViewBounds) {
      map.setCenter(coords)
    }
  };

  updatePosition() {
    this.circle.setCenter(this.props.coords)
  };

  render() {
    const { map } = this.props
    if (map && map.addObject && !this.circle) {
      this.createCircle()
    } else if (this.circle) {
      this.updateCircle()
    }
    return null
  }
}

Circle.propTypes = {
  coords: PropTypes.object.isRequired,
  options: PropTypes.object,
  radius: PropTypes.number,
  setViewBounds: PropTypes.bool,
  map: PropTypes.object,
  objectEvents: PropTypes.object
}

export default Circle
