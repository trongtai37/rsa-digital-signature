import * as React from 'react';
import { Button, Form, Input, Select, FormProps, notification } from 'antd';
import {
  exportPrivateKey,
  exportPublicKey,
  generateRSAKeyPair,
} from '../../utils/crypto';

interface SignerFormValues {
  document: string;
  hash_function: string;
  key_length: number;
  public_key: string;
  private_key: string;
  signature: string;
}

const inititalFormValues: SignerFormValues = {
  document: '',
  hash_function: 'SHA-256',
  key_length: 1024,
  public_key: '',
  private_key: '',
  signature: '',
};

const Signer = () => {
  const [form] = Form.useForm<SignerFormValues>();
  const [isGenerating, setGenerating] = React.useState(false);

  const onFinish: FormProps<SignerFormValues>['onFinish'] = async (values) => {
    try {
      setGenerating(true);
      const { document, hash_function, key_length } = values;

      const { publicKey, privateKey } = await generateRSAKeyPair(key_length);
      const signature = '';

      form.setFieldsValue({
        public_key: await exportPublicKey(publicKey),
        private_key: await exportPrivateKey(privateKey),
        signature: signature,
      });
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          message: error.message,
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: 16, paddingLeft: 16 * 5 }}>
      {/* <Typography.Title>Signer</Typography.Title> */}
      <Form
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        initialValues={inititalFormValues}
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
          <Select>
            <Select.Option value="SHA-256">SHA-256</Select.Option>
            <Select.Option value="SHA-512">SHA-512</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="RSA Key Length" name="key_length" required>
          <Select>
            <Select.Option value={1024}>1024-bit</Select.Option>
            <Select.Option value={2048}>2048-bit</Select.Option>
            <Select.Option value={3072}>3072-bit</Select.Option>
            <Select.Option value={4096}>4096-bit</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="  " colon={false}>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={isGenerating}
          >
            Generate
          </Button>
        </Form.Item>

        <Form.Item label="Public Key" name="public_key">
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item label="Private Key" name="private_key">
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item label="Signature" name="signature">
          <Input.TextArea disabled />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signer;