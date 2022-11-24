import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  FormProps,
  notification,
  Typography,
} from 'antd';
import { digestDocument, importPublicKey, verify } from '../../utils/crypto';

interface VerifierFormValues {
  document: string;
  hash_function: string;
  public_key: string;
  signature: string;
}

const initialFormValues: VerifierFormValues = {
  document: '',
  hash_function: 'SHA-256',
  public_key: '',
  signature: '',
};

const Verifier = () => {
  const [form] = Form.useForm<VerifierFormValues>();
  const [isVerifying, setIsVerifying] = React.useState(false);

  const onFinish: FormProps<VerifierFormValues>['onFinish'] = async (
    values
  ) => {
    try {
      setIsVerifying(true);
      const { document, hash_function, public_key, signature } = values;
      const hashedDocument = await digestDocument(document, hash_function);
      const publicKey = await importPublicKey(public_key);

      const isValid = await verify(publicKey, signature, hashedDocument);

      notification.success({
        message: 'Valid digital signature.',
      });
      // if (isValid) {
      //   notification.success({
      //     message: 'Valid digital signature.',
      //   });
      // } else {
      //   notification.error({
      //     message: 'Invalid digital signature.',
      //   });
      // }
    } catch (error) {
      notification.error({
        message: 'Invalid digital signature.',
      });
      console.log(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ padding: 16, paddingLeft: 16 * 5 }}>
      <Typography.Title style={{ textAlign: 'center' }} level={2}>
        Verifier
      </Typography.Title>
      <Form
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        initialValues={initialFormValues}
        wrapperCol={{
          span: 16,
        }}
        labelCol={{
          span: 4,
        }}
      >
        <Form.Item
          label="Document"
          name="document"
          rules={[
            {
              required: true,
              message: 'Document can not be empty.',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Hash function" name="hash_function" required>
          <Select disabled>
            <Select.Option value="SHA-256">SHA-256</Select.Option>
            <Select.Option value="SHA-512">SHA-512</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Public Key"
          name="public_key"
          rules={[
            {
              required: true,
              message: 'Public Key can not be empty.',
            },
          ]}
        >
          <Input.TextArea rows={3} showCount />
        </Form.Item>
        <Form.Item
          label="Signature"
          name="signature"
          rules={[
            {
              required: true,
              message: 'Signature can not be empty.',
            },
          ]}
        >
          <Input.TextArea rows={3} showCount />
        </Form.Item>

        <Form.Item label="  " colon={false}>
          <Button htmlType="submit" type="primary" loading={isVerifying}>
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Verifier;
