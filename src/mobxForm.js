import React, { Component, PropTypes } from 'react';
import { inject } from 'mobx-react';
import invariant from 'invariant';
import R from 'ramda';

import FormsStore from './FormsStore';
import { MOBX_FORMS } from './utils/consts';

/**
 * Decorator for a component that will be the root of a form.
 *
 * @param options
 * @prop options.form: string - the form's name
 * @prop options.cleanup: ?bool - shall the form be destroyed on unmount?
 */
const mobxForm = options => {
  invariant(options.form, '[mobx-forms] "form" option is required on the "mobxForm" decorator.');

  return WrappedComponent => {
    class FormWrap extends Component {
      getChildContext() {
        return {
          mobxForms: {
            form: this.props.mobxForms.forms[options.form],
            context: '',
          },
        };
      }

      componentWillMount() {
        this.props.mobxForms.addForm(options.form);
      }

      componentWillUnmount() {
        if (options.cleanup) {
          this.props.mobxForms.removeForm(options.form);
        }
      }

      render() {
        const props = R.omit([MOBX_FORMS], this.props);

        props[options.form] = this.props.mobxForms.forms[options.form];

        return React.createElement(WrappedComponent, props);
      }
    }

    FormWrap.propTypes = {
      mobxForms: PropTypes.instanceOf(FormsStore).isRequired,
    };

    FormWrap.childContextTypes = {
      mobxForms: PropTypes.object.isRequired,
    };

    return inject(MOBX_FORMS)(FormWrap);
  };
};

export default mobxForm;
