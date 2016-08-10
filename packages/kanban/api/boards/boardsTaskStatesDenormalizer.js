import { TaskStates } from '../taskstates/taskstates'

const boardsTaskStatesDenormalizer = {

    afterInsertBoard(board) {

        const states = [
            {
                name: 'Todo',
                description: '',
                tasks: 0,
                order: 0
            },
            {
                name: 'In Progress',
                description: '',
                tasks: 0,
                order: 1
            },
            {
                name: 'Review',
                description: '',
                tasks: 0,
                order: 2
            },
            {
                name: 'Done',
                description: '',
                tasks: 0,
                order: 3
            }
        ]

        const user = Meteor.user()

        states.forEach(state => {
            state.boardId = board._id
            state.createdAt = Date.now()
            state.ownerId = user._id
            TaskStates.insert(state)
        })
        return true
    }

};

export default boardsTaskStatesDenormalizer;