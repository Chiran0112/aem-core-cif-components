/*******************************************************************************
 *
 *    Copyright 2019 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/
import React from 'react';

import classes from './changePassword.css';
import { useUserContext } from '../../context/UserContext';
import { useMutation } from '@apollo/react-hooks';

import { func } from 'prop-types';
import { Form } from 'informed';

import Field from '../Field';
import TextInput from '../TextInput';
import Button from '../Button';
import combine from '../../utils/combineValidators';
import { isRequired, validatePassword, validateConfirmPassword, hasLengthAtLeast } from '../../utils/formValidators';
import parseError from '../../utils/parseError';
import LoadingIndicator from '../LoadingIndicator';

import MUTATION_CHANGE_PASSWORD from '../../queries/mutation_change_password.graphql';

const ChangePassword = props => {
    const { showMyAccount } = props;
    const [{ token }] = useUserContext();
    const [doChangePassword, { data, loading, error }] = useMutation(MUTATION_CHANGE_PASSWORD);

    const handleSubmit = formValues => {
        doChangePassword({
            variables: {
                currentPassword: formValues.oldPassword,
                newPassword: formValues.password
            },
            context: {
                headers: {
                    authorization: `Bearer ${token && token.length > 0 ? token : ''}`
                }
            }
        });
    };

    if (loading) {
        return (
            <div className={classes.root}>
                <LoadingIndicator>Loading</LoadingIndicator>
            </div>
        );
    }

    if (data) {
        return (
            <div className={classes.root}>
                <p>Your password was changed.</p>
                <div className={classes.actions}>
                    <Button priority="high" onClick={showMyAccount}>
                        {'Back'}
                    </Button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className={classes.root}>
                <Form onSubmit={handleSubmit}>
                    <Field label="Current Password" required={true}>
                        <TextInput
                            field="oldPassword"
                            type="password"
                            validate={combine([isRequired])}
                            validateOnBlur
                            aria-label="old-password"
                        />
                    </Field>
                    <Field label="New Password" required={true}>
                        <TextInput
                            field="password"
                            type="password"
                            autoComplete="password"
                            validate={combine([isRequired, [hasLengthAtLeast, 8], validatePassword])}
                            validateOnBlur
                            aria-label="password"
                        />
                    </Field>
                    <Field label="Confirm New Password" required={true}>
                        <TextInput
                            field="confirm"
                            type="password"
                            validate={combine([isRequired, validateConfirmPassword])}
                            validateOnBlur
                            aria-label="confirm"
                        />
                    </Field>
                    {error && <div className={classes.error}>{parseError(error)}</div>}
                    <div className={classes.actions}>
                        <Button type="submit" priority="high" aria-label="submit">
                            {'Change Password'}
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
};

ChangePassword.propTypes = {
    showMyAccount: func.isRequired
};

export default ChangePassword;
