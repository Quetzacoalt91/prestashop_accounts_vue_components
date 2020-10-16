<template>
  <b-card no-body>
    <template v-slot:header>
      <h3 class="d-inline">
        <!-- TODO: Use i18n string {billing.billing.choosePlan} -->
        Select your plan
      </h3>
    </template>

    <b-card-body card-body class="align-self-center">

      <b-card-group class="card-deck">
        <template v-for="plan in billing.plans">
          <b-card no-body :key="plan.id" class="text-center" v-bind:class="{ 'header-recommended': plan.recommended, 'header-rectangle': !plan.recommended }">
            <!-- TODO: Use i18n string {billing.billing.recommendedPlan} -->
            <span v-if="plan.recommended">Recommended</span>
          </b-card>
        </template>
      </b-card-group>

      <b-card-group class="card-deck">
        <template v-for="plan in billing.plans">
          <PlanDetails
            :key="plan.id"
            :plan="plan"
            :highestPlan="isHighestPlan(plan)"
            :currentPlan="billing.currentPlan"
            @next="next"
            @downgrade="downgrade"
          />
        </template>
      </b-card-group>

      <div class="text-center" v-if="currentPlanIsFree">
        <small class="text-muted">
          <!-- TODO: Use i18n string {billing.billing.cancelFree} -->
          Not binding subscription - you can cancel whenever your want.
        </small>
      </div>
      <slot />
    </b-card-body>

    <template v-slot:footer>
      <b-button @click="back()">
        <!-- TODO: Use i18n string {billing.billing.back} -->
        Back
      </b-button>
    </template>
  </b-card>
</template>

<script>
  import Locale from '@/mixins/locale';
  import PlanDetails from '@/components/card/PlanDetails';
  import {
    BButton,
    BCard,
    BCardBody,
    BCardGroup,
  } from 'bootstrap-vue';

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
      BCardGroup,
      PlanDetails,
    },
    props: {
      /**
       * The billing object, generated
       * [by prestashop\_accounts\_auth library presenter function](https://github.com/PrestaShopCorp/prestashop_accounts_auth#usage).
       */
      billing: {
        type: Object,
        required: true,
      },
    },
    methods: {
      back() {
        /**
         * Emitted when the Back feature is clicked
         * @type {Event}
         */
        this.$emit('back');
      },
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
      isHighestPlan(cp) {
        return !(this.billing.plans.find(
          (p) => (p.level > cp.level && p.price && p.price.taxIncluded > 0),
        ));
      },
    },
    mounted() {
    },
    computed: {
      currentPlanIsFree() {
        const cp = this.billing.currentPlan;
        if (!cp || !cp.price || !cp.price.taxIncluded || cp.price.taxIncluded === 0) {
          return true;
        }
        return false;
      },
      // classHeaderRecommended: function () {
      //   return {
      //     'header-recommended': plan.recommended,
      //     'header-rectangle': !plan.recommended
      //   }
      // },
    },
    watch: {
    },
  };
</script>

<style scoped>
.card-deck {
  display: flex;
  flex-flow: row wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.card-deck .card {
  flex: 1 0 0%;
  margin-right: 15px;
  margin-bottom: 0;
  margin-left: 15px;
}

.header-recommended {
  background-color: #25B9D7!important;
  color: #FFFFFF;
  border: none;
}

.header-rectangle {
  background-color: transparent;
  border: none;
}
</style>
