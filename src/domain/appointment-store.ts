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
    @observable appointments: Appointment[] = []    

    constructor(appointmentsRef) {
      this.ref = appointmentsRef
    }

    @action release() {
        this.appointments = []
        this.ref.off()        
    }

    setDateRange(from: Date, to: Date) {
        this.release()

        const fromDate = moment(from).startOf('day').toDate()
        const toDate = moment (to).endOf('day').toDate()
        const filteredRef = this.ref.startAt(fromDate.getTime()).endAt(toDate.getTime())

        filteredRef.on('child_added', (child) => {        
            this.doAdd(child.key, child.val())
        })

        filteredRef.on('child_removed', (child) => {          
            this.doRemove(child.key)
        })
    }

    @action private doAdd(key, child) {
        const appointment = new Appointment(child.title, new Date(child.start), new Date(child.end), child.employee)
        appointment.key = key
        this.appointments.push(appointment)
    }

    @action private doRemove(key) {
        this.appointments = this.appointments.filter(appointment => appointment.key !== key)
    }

    filterByEmployee(employee: string): Appointment[] {
        return this.appointments.filter(appointment => appointment.employee === employee)
    }

    getAll(): Appointment[] {
        return this.appointments.slice()
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

    createAppointments(): Appointments {                
        const ref = firebase.database().ref(this.userId + '/appointments')            
        return new Appointments(ref)
    } 
}

export default new AppointmentStore()