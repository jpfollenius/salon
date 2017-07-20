import { observable, action } from 'mobx'

import { CustomerStore, Gender } from './customer-store'

export class CustomerStatistics {
  public count: number
  public maleCount: number
  public femaleCount: number
  public childCount: number

  constructor(count, males, females, children: number) {
    this.count = count
    this.maleCount = males
    this.femaleCount = females
    this.childCount = children
  }
}

export function getGenderStatistics(customerStore: CustomerStore): CustomerStatistics {
  let count = 0
  let maleCount = 0
  let femaleCount = 0
  let childCount = 0

  customerStore.getAll().map(customer => {
    count++
    switch (customer.gender) {
      case Gender.Male:
        maleCount++
        break
      case Gender.Female:
        femaleCount++
        break
      case Gender.Child:
        childCount++
        break
    }
  })

  return new CustomerStatistics(count, maleCount, femaleCount, childCount)
}