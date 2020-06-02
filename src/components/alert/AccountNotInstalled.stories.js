// eslint-disable-next-line import/no-extraneous-dependencies
import {withKnobs, boolean} from '@storybook/addon-knobs';
// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import i18n from '@/i18n/i18n';
import AccountNotInstalled from './AccountNotInstalled';

export default {
  title: 'Alert account not installed',
  component: AccountNotInstalled,
  decorators: [withKnobs],
};

export const notInstalled = () => ({
  components: {AccountNotInstalled},
  props: {
    accountIsInstalled: {
      default: boolean('AccountIsInstalled', false),
    },
  },
  methods: {
    event: action('install'),
  },
  template: '<AccountNotInstalled class="m-4" :accountIsInstalled="accountIsInstalled" @install="event" />',
  i18n,
});