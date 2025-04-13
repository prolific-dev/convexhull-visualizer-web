<template>
  <div class="layout-card">
    <!-- Form -->
    <div class="custom-form">
      <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
        <div v-if="selectedOption === '2D'" class="custom-form-input">
          <InputNumber name="xvalue" :min="0" :max="100" showButtons />
          <Message v-if="$form.xvalue?.invalid" severity="error" size="small" variant="simple">
            {{ $form.xvalue.error?.message }}
          </Message>
          <InputNumber name="yvalue" :min="0" :max="100" showButtons />
          <Message v-if="$form.yvalue?.invalid" severity="error" size="small" variant="simple">
            {{ $form.yvalue.error?.message }}
          </Message>
        </div>
        <div v-else class="custom-form-input">
          <InputNumber name="xvalue" fluid :min="0" :max="100" showButtons />
          <Message v-if="$form.xvalue?.invalid" severity="error" size="small" variant="simple">
            {{ $form.xvalue.error?.message }}
          </Message>
          <InputNumber name="yvalue" fluid :min="0" :max="100" showButtons />
          <Message v-if="$form.yvalue?.invalid" severity="error" size="small" variant="simple">
            {{ $form.yvalue.error?.message }}
          </Message>
          <InputNumber name="zvalue" fluid :min="0" :max="100" showButtons />
          <Message v-if="$form.zvalue?.invalid" severity="error" size="small" variant="simple">
            {{ $form.yvalue.error?.message }}
          </Message>
        </div>
        <div class="custom-form-buttons">
          <Button
            type="submit"
            severity="primary"
            label="Add"
            name="action"
            value="add"
            @click="setAction('add')"
          />
          <Button
            type="submit"
            severity="primary"
            label="Delete"
            name="action"
            value="delete"
            @click="setAction('delete')"
          />
          <Button type="reset" severity="secondary" label="Clear" />
          <Button
            type="submit"
            severity="danger"
            label="Delete All"
            name="action"
            value="clear"
            @click="setAction('clear')"
          />
        </div>
      </Form>
    </div>
    <!-- FileUpload -->
    <div class="custom-upload">
      <FileUpload
        ref="fileUpload"
        mode="basic"
        name="demo[]"
        accept=".csv"
        @select="onFileUpload"
        :auto="false"
        :multiple="false"
        :maxFileSize="1000000"
        chooseLabel="Browse"
        chooseIcon="pi pi-fw pi-search"
      />
      <Button label="Upload" @click="upload" severity="secondary" icon="pi pi-fw pi-upload" />
    </div>
    <!-- Dimension -->
    <div class="custom-dimension">
      <SelectButton v-model="selectedOption" :options="options" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Form } from '@primevue/forms';
import { useGlobalState } from '../../store/store';
import { Point2D, Point3D } from '../../math/math';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const {
  getDimension,
  setDimension,
  addPoint2D,
  addPoint3D,
  removePoint2D,
  removePoint3D,
  clear2D,
  clear3D,
} = useGlobalState();

// Graph Configuration
const options = ['2D', '3D'];
const selectedOption = computed({
  get: () => getDimension() || '2D',
  set: (value) => setDimension(value),
});

const initialValues = ref({
  xvalue: 0,
  yvalue: 0,
  zvalue: 0,
});

// Form Resolver for Validation
const resolver = ({ values }) => {
  const errors = {};

  if (!values.xvalue) {
    errors.xvalue = { message: 'X value is required' };
  }

  if (!values.yvalue) {
    errors.yvalue = { message: 'Y value is required' };
  }

  if (selectedOption.value === '3D' && !values.zvalue) {
    errors.yvalue = { message: 'Z value is required' };
  }

  if (values.xvalue < 0 || values.xvalue > 10) {
    errors.xvalue = { message: 'X value must be between 0 and 10' };
  }

  if (values.yvalue < 0 || values.yvalue > 10) {
    errors.yvalue = { message: 'Y value must be between 0 and 10' };
  }

  if (selectedOption.value === '3D' && (values.zvalue < 0 || values.zvalue > 10)) {
    errors.zvalue = { message: 'Z value must be between 0 and 10' };
  }

  return { values, errors };
};

const currentAction = ref(null);
const setAction = (action) => {
  currentAction.value = action;
};

const onFormSubmit = ({ valid, values }) => {
  if (!valid) return;

  if (currentAction.value === 'add') {
    if (getDimension() === '2D') {
      const point2D = new Point2D(values.xvalue, values.yvalue);
      addPoint2D(point2D);
      toast.add({
        severity: 'success',
        summary: 'Data Point Added',
        detail: `Point ( ${point2D.x} | ${point2D.y} ) has been added successfully.`,
        life: 3000,
      });
    } else {
      const point3D = new Point3D(values.xvalue, values.yvalue, values.zvalue);
      addPoint3D(point3D);
      toast.add({
        severity: 'success',
        summary: 'Data Point Added',
        detail: `Point ( ${point3D.x} | ${point3D.y} | ${point3D.z} ) has been added successfully.`,
        life: 3000,
      });
    }
  } else if (currentAction.value === 'delete') {
    if (getDimension() === '2D') {
      const point2D = new Point2D(values.xvalue, values.yvalue);
      removePoint2D(point2D);
      toast.add({
        severity: 'warn',
        summary: 'Data Point Removed',
        detail: `Point ( ${point2D.x} | ${point2D.y} ) has been removed successfully.`,
        life: 3000,
      });
    } else {
      const point3D = new Point3D(values.xvalue, values.yvalue, values.zvalue);
      removePoint3D(point3D);
      toast.add({
        severity: 'warn',
        summary: 'Data Point Removed',
        detail: `Point ( ${point3D.x} | ${point3D.y} | ${point3D.z} ) has been removed successfully.`,
        life: 3000,
      });
    }
  } else if (currentAction.value === 'clear') {
    if (getDimension() === '2D') {
      clear2D();
      toast.add({
        severity: 'info',
        summary: 'All Points Cleared',
        detail: 'All points have been cleared successfully.',
        life: 3000,
      });
    } else {
      clear3D();
      toast.add({
        severity: 'info',
        summary: 'All Points Cleared',
        detail: 'All points have been cleared successfully.',
        life: 3000,
      });
    }
  }
};

// Handle File Upload
const upload = () => {
  console.log('File Uploaded');

  toast.add({
    severity: 'info',
    summary: 'File Uploaded',
    detail: 'File has been uploaded successfully',
    life: 3000,
  });
};

const onFileUpload = () => {
  toast.add({
    severity: 'info',
    summary: 'File Selected',
    detail: 'File has been selected successfully',
    life: 3000,
  });
};
</script>

<style scoped>
.layout-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.custom-form {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.custom-form-input {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.custom-form-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 1rem;
}

.custom-upload {
  display: inline-flex;
  gap: 1rem;
}

.custom-dimension {
  display: inline-flex;
}

@media (max-width: 1290px) {
  .layout-card {
    flex-direction: column;
  }

  .custom-form {
    flex-direction: column;
    order: 3;
    margin-top: 3rem;
  }
  .custom-form-input {
    flex-direction: column;
  }

  .custom-upload {
    margin-top: 2rem;
    order: 2;
  }

  .custom-dimension {
    order: 1;
  }
}
</style>
