<script setup lang="ts">
import type IProjectData from '@/types/IProjectData';
import type IProjectDetailsData from '@/types/IProjectDetailsData';
import { formatDate } from '@/util/calendar-helpers';

defineProps<{
  projectData?: IProjectData;
  detailsData?: IProjectDetailsData;
}>();
</script>

<template>
  <table class="table table-sm">
    <tbody>
      <tr>
        <th scope="row">Type</th>
        <td>{{ projectData?.projectType.projectTypeName }}</td>
      </tr>
      <tr>
        <th scope="row">Short description</th>
        <td>{{ detailsData?.projectDetails.shortDescription }}</td>
      </tr>
      <tr>
        <th scope="row">Created at</th>
        <td>{{ formatDate(new Date(projectData?.project.uploadedAt ?? '')) }}</td>
      </tr>
      <tr>
        <th scope="row">Genres</th>
        <td>
          <span
            class="badge bg-success me-2"
            v-for="genre in detailsData?.projectGenres"
            :key="genre.id"
          >
            {{ genre.genreName }}
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row">Tags</th>
        <td>
          <span
            class="badge bg-primary me-2"
            v-for="tag in detailsData?.projectTags"
            :key="tag.id"
            >{{ tag.tagName }}</span
          >
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    {{ detailsData?.projectDetails.description }}
  </p>
</template>
