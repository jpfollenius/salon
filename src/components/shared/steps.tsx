import * as React from 'react'

const styles = {
  stepsLayout: {
    margin: '0 10px',
    display: 'flex',
  },
  stepLayout: {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  stepCircle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: 45,    
    textAlign: 'center',
    verticalAlign: 'middle',
    boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
    color: 'white',
    textShadow: 'rgba(0,0,0,0.3) 1px 1px 0',    

  },
  stepTitle: {
    marginLeft: 10,
    marginRight: 40,
    fontWeight: 300,
  },
  openStep: {
    backgroundColor: '#7d7e7d',
  },
  activeStep: {
    backgroundColor: '#F8A50A',
  },
  doneStep: {
    backgroundColor: '#81941F',
  }

}

interface StepsProps {
  steps: string[]
  currentStep: number
  onStepClick: (number) => void
}

export default class Steps extends React.Component<StepsProps, {}> {
  render() {
    return (
      <div style={styles.stepsLayout}>
        {this.props.steps.map((step, index) => {
          let stepStyle

          if (index === this.props.currentStep) {
            stepStyle = styles.activeStep
          } else if (index < this.props.currentStep) {
            stepStyle = styles.doneStep
          } else {
            stepStyle = styles.openStep
          }

          return (
            <div style={styles.stepLayout} onClick={() => this.props.onStepClick(index)}>
              <div style={{...styles.stepCircle, ...stepStyle}}>
                {index + 1}
              </div>
              <div style={styles.stepTitle}>
                {step}
              </div>

            </div>
          )
        })}

      </div>
    )
  }
}