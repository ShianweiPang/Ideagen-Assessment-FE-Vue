<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <h1>The following is my timeline and estimated time taken for this project.</h1>
    <h2>I would suggest to the Product Owner that few things that can be improved in UI.</h2>
    <ul>
      <li>
        To use <strong>date picker</strong> to prevent invalid date format or unknown string
        entered.
      </li>
      <li>
        For customer and country selection, we should provide options for
        <strong>multi-select, or searching enabled</strong>. Prevent long scrolling dropdown.
      </li>
      <li>
        For the readability of the status and category, we can leverage third party libraries for
        <strong>multi-select tags</strong> to be shown up better.
      </li>

      <li>
        When the number of criterias are increasing and might taking more space, introducing
        <strong>collapsible accordion</strong> might be a good option to allow user to expand for
        the criterias that he/she might be interested to filter only.
      </li>
      <li>
        For better user experience, information icon can be placed as a <strong>tooltip</strong> for
        each criteria to show some description or explanation on a complicated criteria.
      </li>
      <li>
        For better user experience, <strong>icons and text</strong> can be used together for a
        better first view
      </li>
    </ul>
    <br />
    <h3>Additional Requirement:</h3>
    <p>
      I would just like to try to answer ;) For different build and deployment, we would definitely
      need different kind of configurations for dev, test, stg, prod. For
      <strong>dev and test we can use normal user account and non-prod Vault</strong> to store some
      of the deployment settings like for K8S deployment example K8S Cluster, K8S Namespace,
      Auth-Config and etc. For <strong>stg and prod, only service and Prod Vault</strong> can be
      allowed to deploy to the K8S for example using different deployment settings. If related to
      scalability, we can leverage the usage of HPA (Horizontal Pod Autoscaling) to increase the
      number of running pods to distribute the load from the applications when the metrices observed
      exceeded a certain threshold that we set in Autoscaling configs. Traffic can be better
      redirected and balanced when requests increase. CI/CD pipeline can make use of the vault and
      account to deploy the application to different environment based on the gitlab branch and
      deployment settings defined in Vault.
    </p>
    <img src="../assets/MyTimeline.jpg" width="100%" />
    <nav>
      <RouterLink to="/sales">Go to Sales Order Listing Page >>></RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
