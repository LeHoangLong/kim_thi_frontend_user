import React, { ComponentType, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/Hooks";
import { Message } from '../components/Message'
import styles from './withMessage.module.scss'

export function withMessage<T>(Component: ComponentType<T>) {
    const ComponentWithMessage = (hocProps: T) => {
        let message = useAppSelector(state => state.messages.message)
        let messageCount = useAppSelector(state => state.messages.count)

        let [lastDisplayedMessageIndex, setLastDisplayedMessageIndex] = useState(0)
        let [showMessage, setShowMessage] = useState(false)

        useEffect(() => {
            if (messageCount > lastDisplayedMessageIndex) {
                setShowMessage(true)
                setLastDisplayedMessageIndex(messageCount)
                setTimeout(() => {
                    setShowMessage(false)
                }, 1000)
            }
        }, [lastDisplayedMessageIndex, messageCount])

        return <React.Fragment>
            <Component
                {...hocProps as T}
            >
            </Component>
            <Message show={showMessage} message={message} className={ styles.mesage }></Message>
        </React.Fragment>
    }

    return ComponentWithMessage
}