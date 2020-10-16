<template>
  <b-card no-body v-bind:class="{ 'border-recommended': showRecommended, 'border-rectangle': !showRecommended }">
    <b-card-header header-class="plan-title">
      <h3 class="text-center">
        <br>
        {{ plan.name }}
        <small class="text-muted">
          <br><br> {{ planPriceFormatted }} <br>
          <template v-if="showPaymentAdvantagePlan">
            <!-- TODO: Use i18n string {billing.billing.taxesInc} Or {billing.billing.taxesExcl}-->
            Incl. taxes
          </template>
          <template v-else>
            &nbsp;
          </template>
        </small>
      </h3>
    </b-card-header>

    <b-card-body class="text-center">
      <div class="align-self-center text-center">
        <h4 class="gray-title" v-if="showCurrentPlan">
          {{ t('billing.billing.currentPlan') }}
        </h4>

        <span v-if="!showCurrentPlan">
          <!-- TODO: Open Modal (No step ? CB ?) -->
          <b-button
            v-if="showHighestPlan"
            variant="primary"
            @click="next(plan.id)"
          >
            {{ t('billing.billing.upgradePlanButton') }}
          </b-button>

          <!-- TODO: Open Modal Confirmation -->
          <b-button
            v-else
            variant="primary"
            @click="downgrade(plan.id)"
          >
            <!-- TODO: Use i18n string {billing.billing.downupgradePlanButton}-->
            Downgrade plan
          </b-button>

          <br><br>
        </span>

        <span v-if="showHighestPlan">
          <!-- TODO: Remove bold only for readability -->
          <!-- TODO: Use i18n string {billing.plan.premiumAdvantages}-->
          <b>{{ plan.name }}</b> includes everything in <b>{{ currentPlan.name }}</b>, plus:<br><br>
        </span>
        <span v-else>
          <!-- TODO: Use i18n string {billing.plan.freeAdvantages} -->
          <b>{{ plan.name }}</b> includes:<br><br>
        </span>
      </div>

      <div class="align-self-center">
        <ul>
          <li>TODO: replace this from module</li>
          <li>TODO: replace this from module</li>
          <li>TODO: replace this from module</li>
        </ul>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import Locale from '@/mixins/locale';
  import {
    BButton,
    BCard,
    BCardBody,
    BCardHeader,
    BCardText,
    BCardGroup,
  } from 'bootstrap-vue';

  const formatPrice = (price, periodicity, t) => {
    const amount = Number(price.taxIncluded / 100);
    const period = t(`billing.billing.periodicity.${periodicity}`);
    const fullPrice = t('billing.priceFormat', {currency: price.currency, amount: amount.toFixed(2)});
    return `${fullPrice} / ${period}`;
  };

  /**
   * This sub-component can be used in a custom integration when the `PsAccounts`
   * component does not meets special needs. This part will display a block to
   * show the available paying plans, if any.
   */
  export default {
    name: 'Plans',
    mixins: [Locale],
    components: {
      BButton,
      BCard,
      BCardBody,
      BCardHeader,
      BCardText,
      BCardGroup,
    },
    props: {
      /**
       * The plan object comes from partially of Billing object (billing.plans).
       */
      plan: {
        type: Object,
        required: true,
      },
      /**
       * The currentPlan object, comes from Billing object (billing.currentPlan).
       */
      currentPlan: {
        type: Object,
        required: true,
      },
      highestPlan: {
        type: Boolean,
        required: true,
      }
    },
    methods: {
      next(plan) {
        /**
         * Emitted when a plan is chosen. The selected plan is given as argument.
         * @type {Event}
         */
        this.$emit('next', plan);
      },
      downgrade(plan) {
        /**
         * Emitted when a plan is chosen. The selected plan is given as argument.
         * @type {Event}
         */
        this.$emit('downgrade', plan);
      },
    },
    mounted() {
    },
    computed: {
      // TODO: rename in style
      showRecommended() {
        const p = this.plan;
        if (!p || !p.recommended) {
          return false;
        }
        return p.recommended;
      },
      showCurrentPlan() {
        const p = this.plan;
        const cp = this.currentPlan;
        if (cp.id !== p.id) {
          return false;
        }
        return cp.id && p.id;
      },
      showPaymentAdvantagePlan() {
        const p = this.plan;
        if (!p || !p.price || !p.price.taxIncluded || p.price.taxIncluded === 0) {
          return  false;
        }
        return p.price && p.price.taxIncluded;
      },
      showHighestPlan() {
        const highestPlan = this.highestPlan;
        return highestPlan;
      },
      planPriceFormatted() {
        const p = this.plan;
        if (!p || !p.price || !p.price.taxIncluded || p.price.taxIncluded === 0) {
          return this.t('billing.billing.priceFree');
        }
        return formatPrice(p.price, p.periodicity, this.t);
      },
    },
    watch: {
    },
  };
</script>

<style scoped>
.flex-grow-1 {
  flex-grow: 1;
}

/* UPGRADE ? */
.border-recommended {
  border: 1px solid #25B9D7!important;
  box-shadow: 0 2px 10px 2px rgba(54,58,65,0.1);

}

.border-rectangle {
  border: 1px solid #BBCDD2!important;
}

.plan-title {
  border: none;
  background: #f4fbfd;
  color: #6c868e;
}
</style>
