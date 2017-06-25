import { observable, action } from 'mobx'
import * as firebase from 'firebase'
import * as moment from 'moment'

export class Appointment {    
    key
    title: string    
    start: Date
    end: Date
    employee: string

    constructor(title: string, start: Date, end: Date, employee: string) {        
        this.title = title
        this.start = start
        this.end = end
        this.employee = employee
    }
}

export class Appointments {
    ref
    startDate: Date
    endDate: Date

    @observable appointments: Appointment[] = []

    constructor(appointmentsRef, startDate: Date, endDate: Date) {
      this.ref = appointmentsRef
      this.startDate = startDate
      this.endDate = endDate  

      this.ref.on('child_added', (child) => {
        console.log('child_added: ', child.val())
        this.doAdd(child.key, child.val())
      })

      this.ref.on('child_removed', (child) => {
          console.log('child_removed: ', child.key)
          this.doRemove(child.key)
      })
    }

    @action doAdd(key, child) {
        const appointment = new Appointment(child.title, new Date(child.start), new Date(child.end), child.employee)
        appointment.key = key
        this.appointments.push(appointment)
    }

    @action doRemove(key) {
        this.appointments = this.appointments.filter(appointment => appointment.key !== key)
    }

    filterByEmployee(employee: string): Appointment[] {
        return this.appointments.filter(appointment => appointment.employee === employee)
    }

    release() {
        this.ref.off()        
    }
}

export class AppointmentStore {
    userId

    load(userId) {
        this.userId = userId
        const db = firebase.database()

        return new Promise((resolve, reject) => {            
            resolve()    
        })
    }

    @action addAppointment(appointment: Appointment) {        
        const listRef = firebase.database().ref(this.userId + '/appointments')
        const ref = listRef.push()              
        ref.setWithPriority({
            title: appointment.title,
            start: appointment.start.getTime(),
            end: appointment.end.getTime(),
            employee: appointment.employee,
        }, appointment.start.getTime())
    }

    getAppointments(from: Date, to: Date): Appointments {        
        console.log(moment(from).startOf('day').toDate().getTime())
        console.log(moment(to).endOf('day').toDate().getTime())        
        const ref = firebase.database().ref(this.userId + '/appointments')            
            .startAt(moment(from).startOf('day').toDate().getTime())
            .endAt(moment (to).endOf('day').toDate().getTime())

        return new Appointments(ref, from, to)
    } 
}

export default new AppointmentStore()