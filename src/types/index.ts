export interface Task {
  id: number
  name: string
  type: 'new' | 'doing' | 'done'
}
