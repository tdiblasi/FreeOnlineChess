import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import * as PieceImages from '../assets/images/pieces'

// const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]
// const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const EVEN_IS_LIGHT = 'aceg'

const PIECE_IMAGES = {
  black: {
    Bishop: PieceImages.blackBishop,
    King: PieceImages.blackKing,
    Knight: PieceImages.blackKnight,
    Pawn: PieceImages.blackPawn,
    Queen: PieceImages.blackQueen,
    Rook: PieceImages.blackRook
  },
  white: {
    Bishop: PieceImages.whiteBishop,
    King: PieceImages.whiteKing,
    Knight: PieceImages.whiteKnight,
    Pawn: PieceImages.whitePawn,
    Queen: PieceImages.whiteQueen,
    Rook: PieceImages.whiteRook
  }
}

const Square = styled.div`
    width:12.5%;
    height:100%;
    padding:0;
    margin:0;
    background-color:${
      props => (props.rank % 2 === 0) === EVEN_IS_LIGHT.includes(props.file) ? '#F6D7AF' : '#553311'
    };
    display:inline-flex;
    align-items:center;
    justify-content:center;
    user-select: none;
    user-drag: none; 
`

// eslint-disable-next-line template-tag-spacing, no-unused-vars
// const PieceImg = styled.div`
//     width:100%;
//     height:100%;
//     display:block;
//     align-self: center;
//     user-select: none;
//     user-drag: none;
//     -moz-user-select: none;
//     -webkit-user-drag: none;
//     -webkit-user-select: none;
//     -ms-user-select: none;
//     draggable="false";
//     background-repeat: no-repeat;
//     background-size: 100%;
// `

const blinkLight = keyframes`
      from {background-color: red}
      to {background-color: #F6D7AF}
  `

const blinkDark = keyframes`
  from {background-color: red}
  to {background-color: #553311}
`

// const blinkAnimation = css`
//   ${blinkLight} 2s linear infinite
// `
const BlinkingLight = styled.div`
  animation: ${blinkLight} 1s linear infinite;
`

const BlinkingDark = styled.div`
  animation: ${blinkDark} 1s linear infinite;
`

const BlinkingLightSquare =
  styled(BlinkingLight)(props => ({
    width: '12.5%',
    height: '100%',
    padding: '0',
    margin: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    userDrag: 'none'
  }))

const BlinkingDarkSquare =
  styled(BlinkingDark)(props => ({
    width: '12.5%',
    height: '100%',
    padding: '0',
    margin: '0',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    userDrag: 'none'
  }))

function BoardSquare (props) {
  BoardSquare.propTypes = {
    rank: PropTypes.number.isRequired,
    file: PropTypes.string.isRequired,
    data: PropTypes.object,
    whitesTurn: PropTypes.bool.isRequired,
    check: PropTypes.string.isRequired,
    checkMate: PropTypes.string,
    possibleMove: PropTypes.bool.isRequired,
    isHovered: PropTypes.bool.isRequired,
    setHover: PropTypes.func.isRequired,
    moveHeld: PropTypes.func.isRequired,
    grabPiece: PropTypes.func.isRequired,
    hide: PropTypes.bool
  }

  const backgroundImage = props.data && !props.hide
    ? {
        backgroundImage: props.data && !props.hide ? `url(${PIECE_IMAGES[props.data.isWhite ? 'white' : 'black'][props.data.piece]})` : null,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    : {}

  const isLightSquare = (props.rank % 2 === 0) ===
  EVEN_IS_LIGHT.includes(props.file)

  const squareInCheck = props.check.length > 0 &&
  props.data &&
  props.data.piece === 'King' &&
  (props.data.isWhite ? 'white' : 'black') === props.check

  const style = {
    ...backgroundImage,
    backgroundImage:
      props.hide
        ? null
        : backgroundImage.backgroundImage,
    boxShadow: (props.isHovered &&
      ((props.data &&
        (props.data.isWhite === props.whitesTurn)) ||
      props.possibleMove ||
      props.hide))
      ? 'inset 0px 0px 0px 5px yellow'
      : ((props.data &&
          (props.data.isWhite !== props.whitesTurn)) &&
        props.possibleMove)
          ? 'inset 0px 0px 0px 5px red'
          : null
  }

  if (!squareInCheck || props.checkMate) {
    style.backgroundColor = squareInCheck
      ? 'red'
      : props.possibleMove
        ? isLightSquare
          ? props.isHovered
            ? '#C1E1C1'
            : '#50C878'
          : props.isHovered
            ? '#C1E1C1'
            : 'darkGreen'
        : props.hide
          ? props.isHovered ? 'khaki' : 'gold'
          : isLightSquare
            ? '#F6D7AF'
            : '#553311'
  }

  // console.log(props.data ? props.data.isWhite : '')

  if (squareInCheck && !props.checkMate) {
    if (isLightSquare) {
      return <BlinkingLightSquare
        id={`square ${props.file}${props.rank}`}
        onMouseDown={() => {
          if (props.data && !props.hide) {
            props.grabPiece([props.file, props.rank])
          }
        }}
        onTouchStart={() => {
          if (props.data && !props.hide) {
            props.grabPiece([props.file, props.rank])
          }
        }}
        onMouseUp={() => {
          props.moveHeld(
            props.file,
            props.rank
          )
        }}
        onTouchEnd={() => {
          console.log('touch end')
          console.log(`${props.rank}${props.file}`)
          console.log()
          props.moveHeld(
            props.file,
            props.rank
          )
        }}
        onMouseEnter={() => {
          props.setHover([props.file, props.rank])
        }}
        onMouseLeave={() => {
          props.setHover([])
        }}
        style={style}
        $isLight={() => isLightSquare}
      >
      </BlinkingLightSquare>
    }
    return <BlinkingDarkSquare
      id={`square ${props.file}${props.rank}`}
      onMouseDown={() => {
        if (props.data && !props.hide) {
          props.grabPiece([props.file, props.rank])
        }
      }}
      onTouchStart={() => {
        if (props.data && !props.hide) {
          props.grabPiece([props.file, props.rank])
        }
      }}
      onMouseUp={() => {
        props.moveHeld(
          props.file,
          props.rank
        )
      }}
      onTouchEnd={() => {
        console.log('touch end')
        console.log(`${props.rank}${props.file}`)
        console.log()
        props.moveHeld(
          props.file,
          props.rank
        )
      }}
      onMouseEnter={() => {
        props.setHover([props.file, props.rank])
      }}
      onMouseLeave={() => {
        props.setHover([])
      }}
      style={style}
      $isLight={() => isLightSquare}
    >
    </BlinkingDarkSquare>
  }
  return <Square
      id={`square ${props.file}${props.rank}`}
      onMouseDown={() => {
        if (props.data && !props.hide) {
          props.grabPiece([props.file, props.rank])
        }
      }}
      onTouchStart={() => {
        if (props.data && !props.hide) {
          props.grabPiece([props.file, props.rank])
        }
      }}
      onMouseUp={() => {
        props.moveHeld(
          props.file,
          props.rank
        )
      }}
      onTouchEnd={() => {
        console.log('touch end')
        console.log(`${props.rank}${props.file}`)
        console.log()
        props.moveHeld(
          props.file,
          props.rank
        )
      }}
      onMouseEnter={() => {
        props.setHover([props.file, props.rank])
      }}
      onMouseLeave={() => {
        props.setHover([])
      }}
      style={style}
    >
    </Square>
}

export default BoardSquare
