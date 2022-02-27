import { ComponentType, useEffect, useState } from "react";
import Symbols from "../../config/Symbols";
import myContainer from "../../container";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks";
import { EStatus } from "../../models/StatusModel";
import { setAddreses, setAddressOperationStatus, setNumberOfAddresses } from "../../reducers/addressReducer";
import { IAddressRepository } from "../../repositories/IAddressRepository";

export function withAddresses<T>(Component: ComponentType<T>) {
    const ComponentWithAddress = (hocProps: T) => {
        let addressOperationStatus = useAppSelector(state => state.addresses.operationStatus)
        let dispatch = useAppDispatch()
        let addressRepository = myContainer.get<IAddressRepository>(Symbols.ADDRESS_REPOSITORY)

        useEffect(() => {
            async function init() {
                try {
                    dispatch(setAddressOperationStatus({
                        status: EStatus.IN_PROGRESS
                    }))
                    let numberOfAddresses = await addressRepository.fetchNumberOfAddresses()
                    let addresses = await addressRepository.fetchAddresses(0, numberOfAddresses)
                    dispatch(setNumberOfAddresses(numberOfAddresses))
                    dispatch(setAddreses(addresses))
                    dispatch(setAddressOperationStatus({
                        status: EStatus.SUCCESS
                    }))
                } finally {
                    dispatch(setAddressOperationStatus({
                        status: EStatus.IDLE
                    }))
                }
            }

            if (addressOperationStatus.status === EStatus.INIT) {
                init()
            }
        }, [addressOperationStatus.status, dispatch, addressRepository])

        return <Component
            {...hocProps as T}
        >
        </Component>
    }
    return ComponentWithAddress
}