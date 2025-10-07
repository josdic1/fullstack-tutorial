import { useEffect } from 'react'
import './Toast.css'

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)  // Auto-close after 3 seconds

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    )
}

export default Toast