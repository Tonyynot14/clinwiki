import * as React from 'react';
import ReactStars from 'react-stars';
import styled,  {keyframes}   from 'styled-components';

interface SubmitAnimationProps {
  resetAnimation: any;
}

const coolBoxKeyframes = keyframes`
  0% {
    opacity: 0;
    top:25%;
    right: 13%



  }

  100%{
      opacity:1;
      top:0;
      right:1%;


  }

`
export const AnimationContainer = styled.div`
width:40px;
padding-left:10px;
`
export const Animation = styled.div`


display: inline-block;
position:absolute;
background: transparent;
width: 30px;

animation-name: ${coolBoxKeyframes};
animation-duration: 2.5s;
animation-timing-function: ease;
animation-delay: 0s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`
class SubmitAnimation extends React.Component<SubmitAnimationProps> {
  componentDidMount() {


//     transform: translate(350px, -350px) rotate(360deg);
// -webkit-transform: translate(350px, -350px) rotate(360deg);
// -o-transform: translate(350px, -350px) rotate(360deg);
// -moz-transform: translate(350px, -350px) rotate(360deg);
  }

  render() {
    this.props.resetAnimation();
    const color = '#A97142';
    return (
      <Animation>
          <ReactStars
            count={1}
            color1={color}
            color2={color}
            half={false}
            size={25}
          />
      </Animation>
    );
  }
}

export default SubmitAnimation;
