import {Button, Form, TextField} from '@adobe/react-spectrum'
import { PageContainer } from '../../components/PageContainer'

export default function Signup() {

    return(
        <PageContainer>
            <h1>Wanna join? Create new account!</h1>
            <Form maxWidth="size-3600" width="100%" isRequired necessityIndicator="label" onSubmit={()=>console.log('submit')}>
                <TextField label="First name" />
                <TextField label="Last name" />
                <TextField label="Phone" />
                <TextField label="Pesel" type='number' maxLength={11} minLength={11}/>
                <TextField label="E-mail" type='email'/>
                <TextField label="Password" type='password'/>
                <Button variant='primary' type='submit'>Create an account</Button>
            </Form>
        </PageContainer>
    )
}