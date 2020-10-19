<template>
  <b-card no-body v-bind:class="classBorderRecommended">
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

        <!-- Need module upgrade -->
        <template v-if="!moduleIsUpdated && !showCurrentPlan">
          <b-button
            block
            variant="outline-secondary"
            @click="updateEvent"
          >
            <!-- TODO: Use i18n string -->
            Upgrade module
          </b-button>

          <br>

          <b-row class="align-self-center text-left">
            <b-col class="align-self-center text-center">
              <b-iconstack
                font-scale="1.5"
                class="mr-2 align-bottom fixed-size"
                width="20"
                height="20"
              >
                <b-icon-circle-fill
                  stacked
                  variant="danger"
                />
                <b-icon-exclamation
                  stacked
                  variant="white"
                />
              </b-iconstack>
            </b-col>
            <b-col cols="10">
              <!-- TODO: Use i18n string -->
              A new plan is available! Upgdate your module to see the new features and to be able to upgrade your plan.
            </b-col>
          </b-row>

        </template>

        <template v-else>
          <span v-if="!showCurrentPlan">
            <!-- TODO: Open Modal (Step 2 ?) -->

            <!-- Muti plans -->
            <template v-if="multiPlans > 2">
              <b-button
                v-if="showRecommendedPlan"
                block
                variant="primary"
                @click="next(plan.id)"
              >
                {{ t('billing.billing.upgradePlanButton') }}
              </b-button>

              <b-button
                v-else
                block
                variant="outline-secondary"
                @click="next(plan.id)"
              >
                {{ t('billing.billing.upgradePlanButton') }}
              </b-button>

            </template>

            <!-- Mono plan -->
            <template v-else>
              <b-button
                v-if="showHighestPlan"
                block
                variant="primary"
                @click="next(plan.id)"
              >
                {{ t('billing.billing.upgradePlanButton') }}
              </b-button>

              <b-button
                v-else
                block
                variant="outline-secondary"
                @click="downgrade(plan.id)"
              >
                <!-- TODO: Use i18n string {billing.billing.downupgradePlanButton}-->
                Downgrade plan
              </b-button>
            </template>
            <br>
          </span>

          <template v-if="multiPlans < 3">
            <span v-if="showHighestPlan">
              <!-- TODO: Remove bold only for readability -->
              <!-- TODO: Use i18n string {billing.plan.premiumAdvantages}-->
              <b>{{ plan.name }}</b> includes everything in <b>{{ currentPlan.name }}</b>, plus:<br><br>
            </span>

            <span v-else>
              <!-- TODO: Use i18n string {billing.plan.freeAdvantages} -->
              <b>{{ plan.name }}</b> includes:<br><br>
            </span>
          </template>
        </template>
      </div>

      <div class="align-self-center" v-if="showCurrentPlan || moduleIsUpdated">
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
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardText,
    BCardGroup,
    BIconstack,
    BIconCircleFill,
    BIconExclamation,
  } from 'bootstrap-vue';

  // TODO: move this to mixins
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
      BRow,
      BCol,
      BCardBody,
      BCardHeader,
      BCardText,
      BCardGroup,
      BIconstack,
      BIconCircleFill,
      BIconExclamation,
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
      },
      moduleIsUpdated: {
        type: Boolean,
        required: true,
      },
      multiPlans: {
        type: Number,
        required: true,
      },
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
      updateEvent() {
        /**
         * Emitted when enable button is clicked.
         * @type {Event}
         */
        this.$emit('updated', true);
      },
    },
    mounted() {
    },
    computed: {
      classBorderRecommended: function () {
        const p = this.plan;
        const cp = this.currentPlan;
        return {
          'border-rectangle': !p.recommended,
          'border-current': p.recommended && cp.id === p.id,
          'border-recommended': p.recommended && cp.id !== p.id,
        }
      },
      showRecommendedPlan() {
        const p = this.plan;
        if (!p || !p.recommended) {
          return  false;
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

/* UPGRADE ? */
.border-recommended {
  border: 1px solid #25B9D7!important;
  box-shadow: 0 2px 10px 2px rgba(54,58,65,0.1);
}

.border-current {
  border: 1px solid #6C868E!important;
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
