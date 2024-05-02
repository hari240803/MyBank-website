function SpaceDiv(props) {
    if (props.flexSpace) return <div className={"flex-fill"}></div>
    return <div style={{height: `${props.height}rem`}}/>;
}

export default SpaceDiv;